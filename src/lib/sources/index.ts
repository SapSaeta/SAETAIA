import type { Source } from './types'
import { anthropicNewsSource } from './anthropic-news'
import { anthropicResearchSource } from './anthropic-research'
import { githubSources } from './github-releases'

/**
 * Registro de todas las fuentes activas.
 * Para añadir OpenAI, Mistral, etc: crear el módulo en sources/ e incluirlo aquí.
 */
export const ALL_SOURCES: Source[] = [
  anthropicNewsSource,
  anthropicResearchSource,
  ...githubSources,
]

export { anthropicNewsSource, anthropicResearchSource, githubSources }
export type { Source }
