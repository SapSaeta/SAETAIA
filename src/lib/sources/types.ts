import type { SourceId, SourceResult } from '@/types/ingest'

export interface Source {
  id: SourceId
  name: string
  baseUrl: string
  fetch(): Promise<SourceResult>
}
