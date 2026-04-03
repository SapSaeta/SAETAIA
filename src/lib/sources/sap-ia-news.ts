/**
 * sap-ia-news.ts
 * Fuentes de noticias SAP + IA:
 *  - sap-news: SAP News Center RSS feed (https://news.sap.com/feed/)
 *  - sap-community: SAP Community blogs filtrados por AI/ML
 *
 * Solo incluye artículos con brand SAP >= 15 Y AI score >= 10.
 */

import type { Source } from './types'
import type { RawItem, SourceResult } from '@/types/ingest'
import {
  parseSitemapUrls,
  parseSitemapIndex,
  extractMeta,
  cleanTitle,
  cutoffDate,
  FETCH_HEADERS,
} from './utils'
import { scoreArticle } from '@/lib/relevance'

const MAX_ARTICLES_PER_SOURCE = 15
const LOOKBACK_DAYS = 90
const ARTICLE_TIMEOUT_MS = 4_000

// Umbral de scoring SAP específico: brand >= 15 AND ai >= 10
// scoreArticle total mínimo aproximado equivalente
const SAP_BRAND_THRESHOLD = 15
const SAP_AI_THRESHOLD    = 10

// Keywords AI/ML para filtro de sitemap SAP Community
const AI_KEYWORDS = [
  'ai', 'artificial-intelligence', 'machine-learning', 'generative',
  'joule', 'llm', 'copilot', 'intelligent', 'automation', 'btp', 'ml',
]

// ─── Parser RSS genérico ──────────────────────────────────────────────────────

export interface RSSItem {
  title: string
  link: string
  pubDate: string
  description: string
}

/**
 * Parsea un feed RSS/Atom y devuelve los artículos.
 * @param url - URL del feed RSS o Atom
 * @returns Array de items con title, link, pubDate y description
 */
export async function parseRSSFeed(url: string): Promise<RSSItem[]> {
  const res = await fetch(url, {
    headers: {
      ...FETCH_HEADERS,
      'Accept': 'application/rss+xml, application/xml, text/xml, */*',
    },
    signal: AbortSignal.timeout(15_000),
  })
  if (!res.ok) throw new Error(`RSS fetch ${url} → HTTP ${res.status}`)
  const xml = await res.text()

  // Soporte Atom (<entry>) y RSS (<item>)
  const isAtom = xml.includes('<feed') && xml.includes('<entry')
  const itemTag = isAtom ? 'entry' : 'item'
  const blocks = xml.match(new RegExp(`<${itemTag}[\\s\\S]*?</${itemTag}>`, 'g')) ?? []

  return blocks.map((block) => {
    // title: puede estar en CDATA
    const titleRaw = extractTagRSS(block, 'title')
    const title = cleanTitle(stripCDATA(titleRaw))

    // link: en RSS es texto, en Atom puede ser href=""
    let link = ''
    const linkTag = block.match(/<link[^>]+href=["']([^"']+)["']/i)
    if (linkTag) {
      link = linkTag[1]
    } else {
      link = stripCDATA(extractTagRSS(block, 'link'))
    }

    // pubDate / published / updated
    const pubDate =
      extractTagRSS(block, 'pubDate') ||
      extractTagRSS(block, 'published') ||
      extractTagRSS(block, 'updated') ||
      ''

    // description / summary / content
    const description = stripCDATA(
      extractTagRSS(block, 'description') ||
      extractTagRSS(block, 'summary') ||
      extractTagRSS(block, 'content')
    )
      .replace(/<[^>]+>/g, ' ')  // strip HTML tags
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 400)

    return { title, link, pubDate, description }
  }).filter((item) => item.title && item.link)
}

/** Extrae el contenido de una etiqueta XML incluyendo posible CDATA */
function extractTagRSS(text: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i')
  const m = text.match(re)
  return m ? m[1].trim() : ''
}

/** Elimina el envoltorio CDATA si existe */
function stripCDATA(text: string): string {
  return text.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1').trim()
}

/** Convierte una fecha RSS (RFC 2822 o ISO) a YYYY-MM-DD */
function parsePubDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0]
  try {
    return new Date(dateStr).toISOString().split('T')[0]
  } catch {
    return new Date().toISOString().split('T')[0]
  }
}

// ─── Comprobación de filtro SAP+AI ───────────────────────────────────────────

/**
 * Verifica si un RawItem cumple los umbrales mínimos de SAP y AI.
 * Usa scoreArticle internamente pero aplica umbrales granulares.
 */
function passesSapAiFilter(raw: RawItem): boolean {
  const text = [raw.title, raw.summary ?? '', raw.url].join(' ').toLowerCase()

  // Brand SAP: contar keywords
  const sapKw = ['sap', 's/4hana', 's4hana', 'business technology platform', 'btp', 'fiori', 'rise with sap', 'joule', 'erp', 'business ai']
  const sapMatches = sapKw.filter((k) => text.includes(k)).length
  const sapScore = sapMatches >= 3 ? 35 : sapMatches >= 2 ? 25 : sapMatches >= 1 ? 15 : 0
  if (sapScore < SAP_BRAND_THRESHOLD) return false

  // AI score: usar scoreArticle y extraer componente AI
  const rel = scoreArticle(raw, 0)
  // Proxy: si score total (sin brand SAP) >= umbral AI mínimo
  // El AI score se refleja indirectamente en el total, usamos threshold aproximado
  const aiProxy = rel.score - sapScore
  if (aiProxy < SAP_AI_THRESHOLD) return false

  return true
}

// ─── Fuente SAP News Center (RSS) ────────────────────────────────────────────

export const sapNewsSource: Source = {
  id: 'sap-news',
  name: 'SAP News Center',
  baseUrl: 'https://news.sap.com',

  async fetch(): Promise<SourceResult> {
    const fetched_at = new Date().toISOString()
    try {
      const feed = await parseRSSFeed('https://news.sap.com/feed/')
      const cutoff = cutoffDate(LOOKBACK_DAYS)

      const items: RawItem[] = feed
        .filter((entry) => {
          const date = parsePubDate(entry.pubDate)
          return date >= cutoff
        })
        .slice(0, MAX_ARTICLES_PER_SOURCE)
        .map((entry) => ({
          source: 'sap-news' as const,
          url: entry.link,
          title: entry.title,
          date: parsePubDate(entry.pubDate),
          summary: entry.description || undefined,
        }))
        .filter((raw) => passesSapAiFilter(raw))

      return { source: 'sap-news', items, fetched_at }
    } catch (error) {
      return {
        source: 'sap-news',
        items: [],
        error: error instanceof Error ? error.message : String(error),
        fetched_at,
      }
    }
  },
}

// ─── Fuente SAP Community (sitemap + filtro AI) ───────────────────────────────

async function resolveCommunityUrls(): Promise<Array<{ loc: string; lastmod?: string }>> {
  const SITEMAP_URL = 'https://community.sap.com/sitemap.xml'
  let xml = ''
  try {
    const res = await fetch(SITEMAP_URL, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(15_000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    xml = await res.text()
  } catch (err) {
    throw new Error(`SAP Community sitemap: ${err instanceof Error ? err.message : String(err)}`)
  }

  let allUrls: Array<{ loc: string; lastmod?: string }> = []

  if (xml.includes('<sitemapindex')) {
    const children = parseSitemapIndex(xml)
    // Priorizar sitemaps con "blog" en la URL
    const blogSms = children.filter((u) => /blog/i.test(u))
    const targets = blogSms.length > 0 ? blogSms.slice(0, 3) : children.slice(0, 3)
    for (const child of targets) {
      try {
        const r = await fetch(child, { headers: FETCH_HEADERS, signal: AbortSignal.timeout(12_000) })
        if (!r.ok) continue
        const childXml = await r.text()
        allUrls.push(...parseSitemapUrls(childXml))
      } catch { /* non-fatal */ }
    }
  } else {
    allUrls = parseSitemapUrls(xml)
  }

  return allUrls
}

async function fetchCommunityMeta(
  url: string
): Promise<Pick<RawItem, 'title' | 'date' | 'summary' | 'imagen'>> {
  const res = await fetch(url, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(ARTICLE_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`Article ${url} → HTTP ${res.status}`)
  const html = await res.text()

  const imagen = extractMeta(html, 'og:image') || undefined
  const ogTitle = extractMeta(html, 'og:title')
  const htmlTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? ''
  const title = cleanTitle(ogTitle || htmlTitle)
  const summary = extractMeta(html, 'og:description') || extractMeta(html, 'description')
  const dateRaw = extractMeta(html, 'article:published_time') || extractMeta(html, 'og:article:published_time')
  const date = dateRaw ? dateRaw.split('T')[0] : ''

  return { title, date, summary, imagen }
}

export const sapCommunitySource: Source = {
  id: 'sap-community',
  name: 'SAP Community Blogs',
  baseUrl: 'https://community.sap.com',

  async fetch(): Promise<SourceResult> {
    const fetched_at = new Date().toISOString()
    try {
      const allUrls = await resolveCommunityUrls()
      const cutoff = cutoffDate(LOOKBACK_DAYS)

      // Filtrar: solo /blogs/ con palabras AI/ML en la URL
      const candidates = allUrls.filter(({ loc, lastmod }) => {
        if (!loc.includes('/blogs/')) return false
        if (/\/blogs\/?$/.test(loc)) return false
        const urlLower = loc.toLowerCase()
        if (!AI_KEYWORDS.some((kw) => urlLower.includes(kw))) return false
        if (lastmod && lastmod < cutoff) return false
        return true
      })

      const subset = candidates.slice(0, MAX_ARTICLES_PER_SOURCE)

      const IS_VERCEL = process.env.VERCEL === '1'
      const items: RawItem[] = IS_VERCEL
        ? subset
            .map(({ loc, lastmod }) => {
              const slug = loc.split('/').filter(Boolean).pop() ?? ''
              const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
              if (!title) return null
              const raw: RawItem = {
                source: 'sap-community' as const,
                url: loc,
                title,
                date: lastmod?.split('T')[0] ?? new Date().toISOString().split('T')[0],
              }
              if (!passesSapAiFilter(raw)) return null
              return raw
            })
            .filter((item): item is NonNullable<typeof item> => item !== null) as RawItem[]
        : await (async () => {
            const results = await Promise.allSettled(
              subset.map(async ({ loc, lastmod }) => {
                const meta = await fetchCommunityMeta(loc)
                if (!meta.title) return null
                const raw: RawItem = {
                  source: 'sap-community' as const,
                  url: loc,
                  title: meta.title,
                  date: meta.date || lastmod?.split('T')[0] || new Date().toISOString().split('T')[0],
                  summary: meta.summary,
                  imagen: meta.imagen,
                }
                if (!passesSapAiFilter(raw)) return null
                return raw
              })
            )
            return results
              .filter((r) => r.status === 'fulfilled' && r.value !== null)
              .map((r) => (r as PromiseFulfilledResult<RawItem>).value)
          })()

      return { source: 'sap-community', items, fetched_at }
    } catch (error) {
      return {
        source: 'sap-community',
        items: [],
        error: error instanceof Error ? error.message : String(error),
        fetched_at,
      }
    }
  },
}
