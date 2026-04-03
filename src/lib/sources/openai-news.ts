/**
 * openai-news.ts
 * Fuente de noticias de OpenAI usando el sitemap público.
 * Solo incluye artículos con RelevanceScore >= 50.
 */

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
import { scoreArticle } from '@/lib/relevance'

const SOURCE_ID = 'openai-news' as const
const SITEMAP_ROOT = 'https://openai.com/sitemap.xml'
const LOOKBACK_DAYS = 90
const MAX_ARTICLES = 20
const ARTICLE_TIMEOUT_MS = 4_000
const RELEVANCE_THRESHOLD = 50
const IS_VERCEL = process.env.VERCEL === '1'

// ─── Resolución de sitemap ────────────────────────────────────────────────────

async function resolveSitemap(
  url: string,
  depth = 0
): Promise<Array<{ loc: string; lastmod?: string }>> {
  if (depth > 2) return []
  const res = await fetch(url, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(15_000),
  })
  if (!res.ok) throw new Error(`Sitemap ${url} → HTTP ${res.status}`)
  const xml = await res.text()

  if (xml.includes('<sitemapindex')) {
    const children = parseSitemapIndex(xml)
    // Priorizar sitemap de blog/news
    const blogSm = children.find((u) => /blog|news|research/i.test(u))
    if (blogSm) return resolveSitemap(blogSm, depth + 1)
    const results: Array<{ loc: string; lastmod?: string }> = []
    for (const child of children.slice(0, 5)) {
      try {
        results.push(...(await resolveSitemap(child, depth + 1)))
      } catch { /* non-fatal */ }
    }
    return results
  }

  return parseSitemapUrls(xml)
}

// ─── Extracción de metadatos por artículo ─────────────────────────────────────

async function fetchArticleMeta(
  url: string
): Promise<Pick<RawItem, 'title' | 'date' | 'summary' | 'imagen'>> {
  const res = await fetch(url, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(ARTICLE_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`Article ${url} → HTTP ${res.status}`)
  const html = await res.text()

  const imagen = extractMeta(html, 'og:image') || undefined

  // Intento 1: JSON-LD
  const ld = extractJsonLd(html)
  if (ld) {
    const title = cleanTitle(String(ld.headline ?? ld.name ?? ''))
    const date = String(ld.datePublished ?? '').split('T')[0]
    const summary = String(ld.description ?? '')
    if (title && date) return { title, date, summary, imagen }
  }

  // Intento 2: OpenGraph / meta tags
  const ogTitle = extractMeta(html, 'og:title')
  const htmlTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? ''
  const title = cleanTitle(ogTitle || htmlTitle)
  const summary = extractMeta(html, 'og:description') || extractMeta(html, 'description')
  const dateRaw = extractMeta(html, 'article:published_time')
  const date = dateRaw ? dateRaw.split('T')[0] : ''

  return { title, date, summary, imagen }
}

// ─── Fuente principal ─────────────────────────────────────────────────────────

export const openaiNewsSource: Source = {
  id: SOURCE_ID,
  name: 'OpenAI News',
  baseUrl: 'https://openai.com',

  async fetch(): Promise<SourceResult> {
    const fetched_at = new Date().toISOString()
    try {
      const allUrls = await resolveSitemap(SITEMAP_ROOT)
      const cutoff = cutoffDate(LOOKBACK_DAYS)

      // Filtrar URLs de blog/research/news dentro del periodo de lookback
      const candidates = allUrls.filter(({ loc, lastmod }) => {
        if (!/\/(blog|research|news)\//.test(loc)) return false
        // Excluir páginas índice
        if (/\/(blog|research|news)\/?$/.test(loc)) return false
        if (lastmod && lastmod < cutoff) return false
        return true
      })

      const subset = candidates.slice(0, MAX_ARTICLES)

      const items: RawItem[] = IS_VERCEL
        ? subset
            .map(({ loc, lastmod }) => {
              const slug = loc.split('/').filter(Boolean).pop() ?? ''
              const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
              if (!title) return null
              const raw: RawItem = {
                source: SOURCE_ID,
                url: loc,
                title,
                date: lastmod?.split('T')[0] ?? new Date().toISOString().split('T')[0],
              }
              // Apply relevance filter
              const rel = scoreArticle(raw, RELEVANCE_THRESHOLD)
              if (!rel.isRelevant) return null
              return raw
            })
            .filter((item): item is NonNullable<typeof item> => item !== null) as RawItem[]
        : await (async () => {
            const results = await Promise.allSettled(
              subset.map(async ({ loc, lastmod }) => {
                const meta = await fetchArticleMeta(loc)
                if (!meta.title) return null
                const raw: RawItem = {
                  source: SOURCE_ID,
                  url: loc,
                  title: meta.title,
                  date: meta.date || lastmod?.split('T')[0] || new Date().toISOString().split('T')[0],
                  summary: meta.summary,
                  imagen: meta.imagen,
                }
                // Apply relevance filter
                const rel = scoreArticle(raw, RELEVANCE_THRESHOLD)
                if (!rel.isRelevant) return null
                return raw
              })
            )
            return results
              .filter((r) => r.status === 'fulfilled' && r.value !== null)
              .map((r) => (r as PromiseFulfilledResult<RawItem>).value)
          })()

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
