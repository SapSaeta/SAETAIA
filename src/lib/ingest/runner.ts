import { randomUUID } from 'crypto'
import type { RunLog } from '@/types/ingest'
import { ALL_SOURCES } from '@/lib/sources'
import { normalize } from './normalizer'
import { buildDedupIndex, checkDuplicate } from './dedup'
import { getAllStoredEntries, saveEntry } from './store'

/**
 * Ejecuta el pipeline completo de ingesta:
 * 1. Carga fuentes activas
 * 2. Hace fetch en paralelo
 * 3. Normaliza cada item
 * 4. Deduplica contra entradas existentes
 * 5. Guarda novedades como draft
 * 6. Devuelve el log de la ejecución
 */
export async function runIngest(): Promise<RunLog> {
  const run_id = randomUUID()
  const started_at = new Date().toISOString()

  const log: RunLog = {
    run_id,
    started_at,
    finished_at: '',
    sources: {},
    total_new: 0,
    total_errors: 0,
  }

  // Cargar entradas existentes una sola vez para construir el índice de dedup
  const existingEntries = await getAllStoredEntries()
  const dedupIndex = buildDedupIndex(existingEntries)

  // Ejecutar todas las fuentes en paralelo (fallo de una no afecta a las demás)
  const sourceResults = await Promise.allSettled(
    ALL_SOURCES.map((source) => source.fetch())
  )

  for (const result of sourceResults) {
    if (result.status === 'rejected') {
      // Error de fuente inesperado (normalmente el catch interno lo captura)
      log.total_errors++
      continue
    }

    const { source: sourceId, items, error } = result.value
    log.sources[sourceId] = {
      fetched: items.length,
      new_draft: 0,
      duplicate: 0,
      error,
    }

    if (error) {
      log.total_errors++
    }

    for (const rawItem of items) {
      const entry = normalize(rawItem)
      const dupCheck = checkDuplicate(rawItem, entry.slug, dedupIndex)

      if (dupCheck.isDuplicate) {
        log.sources[sourceId]!.duplicate++
        continue
      }

      try {
        await saveEntry(entry)
        // Actualizar índice en memoria para evitar duplicados dentro de la misma ejecución
        dedupIndex.urls.add(rawItem.url)
        dedupIndex.slugs.add(entry.slug)
        dedupIndex.titles.push(rawItem.title)

        log.sources[sourceId]!.new_draft++
        log.total_new++
      } catch (saveError) {
        log.sources[sourceId]!.error = (saveError as Error).message
        log.total_errors++
      }
    }
  }

  log.finished_at = new Date().toISOString()
  return log
}
