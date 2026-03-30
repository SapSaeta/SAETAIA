/** Extrae el valor de una etiqueta XML/HTML simple, primera ocurrencia */
export function extractTag(text: string, tag: string): string {
  const match = text.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`))
  return match ? match[1].trim() : ''
}

/** Extrae todos los valores de una etiqueta XML/HTML */
export function extractAllTags(text: string, tag: string): string[] {
  const results: string[] = []
  const re = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'g')
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) results.push(m[1].trim())
  return results
}

/** Extrae el contenido del atributo `content` de una etiqueta meta */
export function extractMeta(html: string, name: string): string {
  // <meta name="..." content="..."> o <meta property="..." content="...">
  const re1 = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*?)["']`,
    'i'
  )
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']*?)["'][^>]+(?:name|property)=["']${name}["']`,
    'i'
  )
  return (html.match(re1)?.[1] ?? html.match(re2)?.[1] ?? '').trim()
}

/** Parsea el primer bloque JSON-LD de la página */
export function extractJsonLd(html: string): Record<string, unknown> | null {
  const match = html.match(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i
  )
  if (!match) return null
  try { return JSON.parse(match[1]) } catch { return null }
}

/** Parsea las URLs de un sitemap XML (no un sitemapindex) */
export function parseSitemapUrls(xml: string): Array<{ loc: string; lastmod?: string }> {
  const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? []
  return blocks.map((block) => ({
    loc: extractTag(block, 'loc').replace(/&amp;/g, '&'),
    lastmod: extractTag(block, 'lastmod') || undefined,
  })).filter((u) => u.loc.length > 0)
}

/** Devuelve los href de un sitemapindex */
export function parseSitemapIndex(xml: string): string[] {
  return extractAllTags(xml, 'loc').filter(Boolean)
}

/** Fecha de corte (hace N días) en YYYY-MM-DD */
export function cutoffDate(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

/** Limpia y normaliza un título: elimina sufijos de site name */
export function cleanTitle(title: string): string {
  return title
    .replace(/\s*[|–—-]\s*(Anthropic|Claude|GitHub).*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/** Cabeceras comunes para fetch */
export const FETCH_HEADERS = {
  'User-Agent': 'SaetaIA-Ingest/1.0 (https://saetaia.com)',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
} as const
