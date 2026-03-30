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

const SOURCE_ID = 'anthropic-research' as const
const SITEMAP_ROOT = 'https://www.anthropic.com/sitemap.xml'
const LOOKBACK_DAYS = 60
const MAX_ARTICLES = 3
const ARTICLE_TIMEOUT_MS = 2_500
const IS_VERCEL = process.env.VERCEL === '1'

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
    const results: Array<{ loc: string; lastmod?: string }> = []
    for (const child of children.slice(0, 4)) {
      try {
        results.push(...(await resolveSitemap(child, depth + 1)))
      } catch { /* non-fatal */ }
    }
    return results
  }
  return parseSitemapUrls(xml)
}

async function fetchArticleMeta(url: string): Promise<Pick<RawItem, 'title' | 'date' | 'summary' | 'imagen'>> {
  const res = await fetch(url, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(ARTICLE_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`Article ${url} → HTTP ${res.status}`)
  const html = await res.text()

  const imagen = extractMeta(html, 'og:image') || undefined

  const ld = extractJsonLd(html)
  if (ld) {
    const title = cleanTitle(String(ld.headline ?? ld.name ?? ''))
    const date = String(ld.datePublished ?? '').split('T')[0]
    const summary = String(ld.description ?? '')
    if (title && date) return { title, date, summary, imagen }
  }

  const ogTitle = extractMeta(html, 'og:title')
  const htmlTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? ''
  const title = cleanTitle(ogTitle || htmlTitle)
  const summary = extractMeta(html, 'og:description') || extractMeta(html, 'description')
  const dateRaw = extractMeta(html, 'article:published_time')
  const date = dateRaw ? dateRaw.split('T')[0] : ''

  return { title, date, summary, imagen }
}

export const anthropicResearchSource: Source = {
  id: SOURCE_ID,
  name: 'Anthropic Research',
  baseUrl: 'https://www.anthropic.com',

  async fetch(): Promise<SourceResult> {
    const fetched_at = new Date().toISOString()
    try {
      const allUrls = await resolveSitemap(SITEMAP_ROOT)
      const cutoff = cutoffDate(LOOKBACK_DAYS)

      const candidates = allUrls.filter(({ loc, lastmod }) => {
        if (!loc.includes('/research/')) return false
        if (loc.endsWith('/research') || loc.endsWith('/research/')) return false
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
              return {
                source: SOURCE_ID,
                url: loc,
                title,
                date: lastmod?.split('T')[0] ?? new Date().toISOString().split('T')[0],
                tags: ['research', 'paper'],
              } satisfies RawItem
            })
            .filter((item): item is NonNullable<typeof item> => item !== null) as RawItem[]
        : await (async () => {
            const results = await Promise.allSettled(
              subset.map(async ({ loc, lastmod }) => {
                const meta = await fetchArticleMeta(loc)
                if (!meta.title) return null
                return {
                  source: SOURCE_ID,
                  url: loc,
                  title: meta.title,
                  date: meta.date || lastmod?.split('T')[0] || new Date().toISOString().split('T')[0],
                  summary: meta.summary,
                  imagen: meta.imagen,
                  tags: ['research', 'paper'],
                } satisfies RawItem
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
