import type { Noticia } from '@/types'
import type { Brand, ContentEntry } from '@/types/ingest'

// ─── HerramientaItem ────────────────────────────────────────────────────────

export interface HerramientaItem {
  id: string
  slug: string
  nombre: string
  descripcion: string
  contenido: string
  categoria: string
  tags: string[]
  estado: string
  url_docs?: string
  imagen?: string
  fecha: string
  brand: Brand
}

// ─── Helpers de lectura de archivos (server-side only) ───────────────────────

function readJsonDir(dirPath: string): ContentEntry[] {
  if (typeof window !== 'undefined') return []
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path') as typeof import('path')
    if (!fs.existsSync(dirPath)) return []
    const files = fs.readdirSync(dirPath).filter((f: string) => f.endsWith('.json'))
    const results: ContentEntry[] = []
    for (const file of files) {
      try {
        const entry = JSON.parse(
          fs.readFileSync(path.join(dirPath, file), 'utf-8')
        ) as ContentEntry
        results.push(entry)
      } catch { /* skip malformed */ }
    }
    return results
  } catch {
    return []
  }
}

function entryToNoticia(entry: ContentEntry): Noticia {
  return {
    id: entry.id,
    slug: entry.slug,
    fecha: entry.fecha,
    titulo: entry.titulo,
    resumen: entry.resumen,
    contenido: entry.contenido,
    categoria: entry.categoria,
    tags: entry.tags,
    url_referencia: entry.url_referencia,
    imagen: entry.imagen,
  }
}

function entryToHerramienta(entry: ContentEntry, brand: Brand): HerramientaItem {
  return {
    id: entry.id,
    slug: entry.slug,
    nombre: entry.titulo,
    descripcion: entry.resumen,
    contenido: entry.contenido,
    categoria: entry.categoria,
    tags: entry.tags,
    estado: 'ga',
    url_docs: entry.url_referencia,
    imagen: entry.imagen,
    fecha: entry.fecha,
    brand,
  }
}

// ─── API pública ─────────────────────────────────────────────────────────────

export function getContenidoByBrand(brand: Brand): {
  noticias: Noticia[]
  herramientas: HerramientaItem[]
} {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require('path') as typeof import('path')
  const brandDir = path.join(process.cwd(), 'content', brand)
  const brandEntries = readJsonDir(brandDir)

  // For Anthropic, also include legacy content/noticias/ entries
  const legacyEntries: ContentEntry[] =
    brand === 'anthropic'
      ? readJsonDir(path.join(process.cwd(), 'content', 'noticias')).filter(
          (e) => !e.brand || e.brand === 'anthropic'
        )
      : []

  // Merge, deduplicate by id
  const seenIds = new Set<string>()
  const allEntries: ContentEntry[] = []
  for (const e of [...brandEntries, ...legacyEntries]) {
    if (!seenIds.has(e.id)) {
      seenIds.add(e.id)
      allEntries.push(e)
    }
  }

  const published = allEntries.filter((e) => e.status === 'published')

  const noticias: Noticia[] = published
    .filter((e) => !e.tipo || e.tipo === 'noticia')
    .map(entryToNoticia)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))

  const herramientas: HerramientaItem[] = published
    .filter((e) => e.tipo === 'herramienta')
    .map((e) => entryToHerramienta(e, brand))
    .sort((a, b) => b.fecha.localeCompare(a.fecha))

  return { noticias, herramientas }
}

export function getAllContenido(): {
  brand: Brand
  noticias: Noticia[]
  herramientas: HerramientaItem[]
}[] {
  const brands: Brand[] = ['anthropic', 'sap', 'openai']
  return brands.map((brand) => ({ brand, ...getContenidoByBrand(brand) }))
}
