import type { Source } from './types'
import type { RawItem, SourceResult } from '@/types/ingest'
import {
  parseSitemapUrls,
  parseSitemapIndex,
  extractJsonLd,
  extractMeta,
  cleanTitle,
  cutoffDate,
  FETCH_HEADERS,
} from './utils'

const SOURCE_ID = 'anthropic-news' as const
const SITEMAP_ROOT = 'https://www.anthropic.com/sitemap.xml'
const LOOKBACK_DAYS = 35
const MAX_ARTICLES = 20

/** Resuelve el sitemap raíz: si es un índice, encuentra el de noticias */
async function resolveSitemap(url: string, depth = 0): Promise<Array<{ loc: string; lastmod?: string }>> {
  if (depth > 2) return []
  const res = await fetch(url, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(15_000),
  })
  if (!res.ok) throw new Error(`Sitemap ${url} → HTTP ${res.status}`)
  const xml = await res.text()

  if (xml.includes('<sitemapindex')) {
    const children = parseSitemapIndex(xml)
    // Prioritize a news-specific sitemap
    const newsSm = children.find((u) => /news|blog|post/i.test(u))
    if (newsSm) return resolveSitemap(newsSm, depth + 1)
    // Otherwise merge first few child sitemaps
    const results: Array<{ loc: string; lastmod?: string }> = []
    for (const child of children.slice(0, 4)) {
      try {
        results.push(...(await resolveSitemap(child, depth + 1)))
      } catch { /* source failure is non-fatal */ }
    }
    return results
  }

  return parseSitemapUrls(xml)
}

/** Extrae metadatos de una página de artículo */
async function fetchArticleMeta(url: string): Promise<Pick<RawItem, 'title' | 'date' | 'summary' | 'imagen'>> {
  const res = await fetch(url, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(12_000),
  })
  if (!res.ok) throw new Error(`Article ${url} → HTTP ${res.status}`)
  const html = await res.text()

  const imagen = extractMeta(html, 'og:image') || undefined

  // Intento 1: JSON-LD (el más estructurado)
  const ld = extractJsonLd(html)
  if (ld) {
    const title = cleanTitle(String(ld.headline ?? ld.name ?? ''))
    const date = String(ld.datePublished ?? '').split('T')[0]
    const summary = String(ld.description ?? '')
    if (title && date) return { title, date, summary, imagen }
  }

  // Intento 2: meta tags OpenGraph / standard
  const ogTitle = extractMeta(html, 'og:title')
  const htmlTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? ''
  const title = cleanTitle(ogTitle || htmlTitle)
  const summary = extractMeta(html, 'og:description') || extractMeta(html, 'description')
  const dateRaw = extractMeta(html, 'article:published_time')
  const date = dateRaw ? dateRaw.split('T')[0] : ''

  return { title, date, summary, imagen }
}

export const anthropicNewsSource: Source = {
  id: SOURCE_ID,
  name: 'Anthropic News',
  baseUrl: 'https://www.anthropic.com',

  async fetch(): Promise<SourceResult> {
    const fetched_at = new Date().toISOString()
    try {
      const allUrls = await resolveSitemap(SITEMAP_ROOT)
      const cutoff = cutoffDate(LOOKBACK_DAYS)

      const candidates = allUrls.filter(({ loc, lastmod }) => {
        if (!loc.includes('/news/')) return false
        // Excluir la página índice
        if (loc.endsWith('/news') || loc.endsWith('/news/')) return false
        if (lastmod && lastmod < cutoff) return false
        return true
      })

      const items: RawItem[] = []
      for (const { loc, lastmod } of candidates.slice(0, MAX_ARTICLES)) {
        try {
          const meta = await fetchArticleMeta(loc)
          if (!meta.title) continue
          items.push({
            source: SOURCE_ID,
            url: loc,
            title: meta.title,
            date: meta.date || lastmod?.split('T')[0] || new Date().toISOString().split('T')[0],
            summary: meta.summary,
            imagen: meta.imagen,
          })
        } catch { /* individual article failure is non-fatal */ }
      }

      return { source: SOURCE_ID, items, fetched_at }
    } catch (error) {
      return {
        source: SOURCE_ID,
        items: [],
        error: error instanceof Error ? error.message : String(error),
        fetched_at,
      }
    }
  },
}
