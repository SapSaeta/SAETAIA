import { NOTICIAS } from '@/data/noticias'
import type { Categoria, Noticia } from '@/types'
import type { ContentEntry } from '@/types/ingest'

// ─── Lectura de content/noticias/ (Server-side / build time only) ────────────

function getContentNoticias(): Noticia[] {
  if (typeof window !== 'undefined') return []
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path') as typeof import('path')
    const dir = path.join(process.cwd(), 'content', 'noticias')
    if (!fs.existsSync(dir)) return []

    const files = fs.readdirSync(dir).filter((f: string) => f.endsWith('.json'))
    const result: Noticia[] = []

    for (const file of files) {
      try {
        const entry = JSON.parse(
          fs.readFileSync(path.join(dir, file), 'utf-8')
        ) as ContentEntry
        if (entry.status !== 'published') continue
        result.push({
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
        })
      } catch { /* saltar archivos malformados */ }
    }
    return result
  } catch {
    return []
  }
}

// ─── Fusión y deduplicación ──────────────────────────────────────────────────

function getMergedNoticias(): Noticia[] {
  const contentNoticias = getContentNoticias()
  const contentIds = new Set(contentNoticias.map((n) => n.id))
  const contentSlugs = new Set(contentNoticias.map((n) => n.slug))

  // Las entradas de data/ actúan como base legacy; las de content/ tienen prioridad
  const legacy = NOTICIAS.filter(
    (n) => !contentIds.has(n.id) && !contentSlugs.has(n.slug)
  )

  return [...contentNoticias, ...legacy].sort((a, b) => b.fecha.localeCompare(a.fecha))
}

// ─── API pública (idéntica a la anterior) ────────────────────────────────────

export function getAllNoticias(): Noticia[] {
  return getMergedNoticias()
}

export function getNoticiaBySlug(slug: string): Noticia | undefined {
  return getMergedNoticias().find((n) => n.slug === slug)
}

export function getNoticiasByCategoria(categoria: Categoria): Noticia[] {
  return getMergedNoticias().filter((n) => n.categoria === categoria)
}

export function searchNoticias(query: string): Noticia[] {
  const q = query.toLowerCase().trim()
  if (!q) return getMergedNoticias()
  return getMergedNoticias().filter(
    (n) =>
      n.titulo.toLowerCase().includes(q) ||
      n.resumen.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
  )
}

export function getCategoriasConConteo(): Record<Categoria, number> {
  return getMergedNoticias().reduce(
    (acc, n) => {
      acc[n.categoria] = (acc[n.categoria] ?? 0) + 1
      return acc
    },
    {} as Record<Categoria, number>
  )
}
