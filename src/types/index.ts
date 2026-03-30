export type Categoria =
  | 'LLMs'
  | 'Herramientas'
  | 'Investigación'
  | 'API'
  | 'Seguridad'
  | 'Empresa'

export interface Noticia {
  id: string
  slug: string
  fecha: string // YYYY-MM-DD
  titulo: string
  resumen: string
  contenido: string
  categoria: Categoria
  tags: string[]
  imagen?: string
  url_referencia?: string
}

export type HerramientaCategoria =
  | 'Agentes'
  | 'Codificación'
  | 'Integración'
  | 'Interfaz'
  | 'Datos'

export type HerramientaEstado = 'experimental' | 'preview' | 'beta' | 'ga'

export interface Herramienta {
  id: string
  slug: string
  nombre: string
  descripcion: string
  contenido: string
  categoria: HerramientaCategoria
  tags: string[]
  estado: HerramientaEstado
  fecha_lanzamiento: string
  compatible_con: string[]
  url_docs?: string
  url_repo?: string
}
