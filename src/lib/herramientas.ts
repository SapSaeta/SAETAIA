import { HERRAMIENTAS } from '@/data/herramientas'
import { Herramienta, HerramientaCategoria } from '@/types'

export function getAllHerramientas(): Herramienta[] {
  return [...HERRAMIENTAS].sort((a, b) => b.fecha_lanzamiento.localeCompare(a.fecha_lanzamiento))
}

export function getHerramientaBySlug(slug: string): Herramienta | undefined {
  return HERRAMIENTAS.find((h) => h.slug === slug)
}

export function getHerramientasByCategoria(categoria: HerramientaCategoria): Herramienta[] {
  return getAllHerramientas().filter((h) => h.categoria === categoria)
}

export function searchHerramientas(query: string): Herramienta[] {
  const q = query.toLowerCase().trim()
  if (!q) return getAllHerramientas()
  return getAllHerramientas().filter(
    (h) =>
      h.nombre.toLowerCase().includes(q) ||
      h.descripcion.toLowerCase().includes(q) ||
      h.tags.some((t) => t.toLowerCase().includes(q)) ||
      h.compatible_con.some((c) => c.toLowerCase().includes(q))
  )
}

export function getCategoriasHerramientas(): HerramientaCategoria[] {
  const cats = new Set(HERRAMIENTAS.map((h) => h.categoria))
  return Array.from(cats).sort()
}
