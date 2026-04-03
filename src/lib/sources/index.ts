import type { Source } from './types'
import { anthropicNewsSource } from './anthropic-news'
import { anthropicResearchSource } from './anthropic-research'
import { githubSources } from './github-releases'
import { openaiNewsSource } from './openai-news'
import { openaiToolsSource } from './openai-tools'
import { sapNewsSource, sapCommunitySource } from './sap-ia-news'

// ─── Fuentes con flag enabled para no romper el ingest actual ────────────────

interface SourceEntry {
  source: Source
  /** Si false, la fuente existe pero no se incluye en ALL_SOURCES por defecto */
  enabled: boolean
}

const SOURCE_REGISTRY: SourceEntry[] = [
  // Fuentes originales (siempre activas)
  { source: anthropicNewsSource,     enabled: true  },
  { source: anthropicResearchSource, enabled: true  },
  ...githubSources.map((s) => ({ source: s, enabled: true })),
  // Nuevas fuentes (enabled: false para no romper el ingest actual)
  { source: openaiNewsSource,        enabled: false },
  { source: openaiToolsSource,       enabled: false },
  { source: sapNewsSource,           enabled: false },
  { source: sapCommunitySource,      enabled: false },
]

/**
 * Registro de todas las fuentes activas por defecto.
 * Equivale al comportamiento original del pipeline.
 */
export const ALL_SOURCES: Source[] = SOURCE_REGISTRY
  .filter((entry) => entry.enabled)
  .map((entry) => entry.source)

/**
 * Todas las fuentes agrupadas por brand.
 * Útil para ingesta selectiva (por ej. ingestar solo fuentes OpenAI).
 */
export const ALL_SOURCES_BY_BRAND: Record<'anthropic' | 'openai' | 'sap', Source[]> = {
  anthropic: [anthropicNewsSource, anthropicResearchSource, ...githubSources],
  openai:    [openaiNewsSource, openaiToolsSource],
  sap:       [sapNewsSource, sapCommunitySource],
}

// Re-exports
export {
  anthropicNewsSource,
  anthropicResearchSource,
  githubSources,
  openaiNewsSource,
  openaiToolsSource,
  sapNewsSource,
  sapCommunitySource,
}
export type { Source }
