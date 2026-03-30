import type { Categoria } from './index'

export type IngestStatus = 'draft' | 'published' | 'rejected'

export type SourceId =
  | 'anthropic-news'
  | 'anthropic-research'
  | 'github-sdk-python'
  | 'github-claude-code'

/** Item crudo tal como llega de la fuente, sin normalizar */
export interface RawItem {
  source: SourceId
  url: string
  title: string
  date: string       // YYYY-MM-DD
  summary?: string
  content?: string
  tags?: string[]
  imagen?: string    // og:image URL
}

/** Entrada almacenada en content/noticias/{slug}.json */
export interface ContentEntry {
  id: string
  slug: string
  status: IngestStatus
  source: SourceId
  url_referencia: string
  fecha: string           // YYYY-MM-DD
  titulo: string
  resumen: string
  contenido: string
  categoria: Categoria
  tags: string[]
  imagen?: string         // og:image URL de la fuente
  ingested_at: string     // ISO datetime
  published_at?: string   // ISO datetime
}

/** Resultado de una fuente en una ejecución */
export interface SourceResult {
  source: SourceId
  items: RawItem[]
  error?: string
  fetched_at: string
}

/** Log de una ejecución completa del pipeline */
export interface RunLog {
  run_id: string
  started_at: string
  finished_at: string
  sources: Partial<Record<SourceId, {
    fetched: number
    new_draft: number
    duplicate: number
    error?: string
  }>>
  total_new: number
  total_errors: number
}
