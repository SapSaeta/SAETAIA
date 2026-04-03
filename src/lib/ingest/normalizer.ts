import type { Categoria } from '@/types'
import type { RawItem, ContentEntry, SourceId, Brand, ContentTipo } from '@/types/ingest'
import { createHash } from 'crypto'
import { classifyBrand, detectTipo } from '@/lib/relevance'

// ─── Asignación de categorías ────────────────────────────────────────────────

const CATEGORY_RULES: Array<{ pattern: RegExp; categoria: Categoria }> = [
  // Seguridad primero (evita falsos positivos con "safe" en otros contextos)
  { pattern: /safe(ty|guard)|security|alignment|constit|harm|risk|policy|abuse/i, categoria: 'Seguridad' },
  // Investigación
  { pattern: /research|study|paper|interpret|science|discover|analys|survey|benchmark/i, categoria: 'Investigación' },
  // API / SDK / releases
  { pattern: /sdk|api\b|endpoint|version\s+\d|v\d+\.\d|release|changelog|developer/i, categoria: 'API' },
  // Herramientas
  { pattern: /tool|plugin|mcp|computer use|code\b|cli|extension|workspace|skill|dispatch|cowork/i, categoria: 'Herramientas' },
  // LLMs
  { pattern: /claude|model|llm|gpt|language model|opus|sonnet|haiku|token|context|fine.?tun/i, categoria: 'LLMs' },
  // Empresa como fallback
  { pattern: /anthropic|openai|sap|company|fund|partner|team|announce|invest|valuat/i, categoria: 'Empresa' },
]

function assignCategoria(raw: RawItem): Categoria {
  const text = `${raw.title} ${raw.summary ?? ''} ${raw.url}`
  for (const { pattern, categoria } of CATEGORY_RULES) {
    if (pattern.test(text)) return categoria
  }
  // Fallback por fuente
  if (raw.source === 'anthropic-research') return 'Investigación'
  if (raw.source === 'github-sdk-python' || raw.source === 'github-claude-code') return 'API'
  if (raw.source === 'openai-github') return 'API'
  if (raw.source === 'openai-research') return 'Investigación'
  return 'Empresa'
}

// ─── Generación de slug ──────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function generateSlug(title: string, date: string): string {
  const year = date.slice(0, 4)
  const month = date.slice(5, 7)
  return `${year}-${month}-${slugify(title)}`
}

// ─── Generación de ID ────────────────────────────────────────────────────────

function generateId(url: string): string {
  return createHash('sha256').update(url).digest('hex').slice(0, 12)
}

// ─── Tags ────────────────────────────────────────────────────────────────────

const SOURCE_TAGS: Partial<Record<SourceId, string[]>> = {
  'anthropic-news':     ['anthropic', 'news'],
  'anthropic-research': ['anthropic', 'research', 'paper'],
  'github-sdk-python':  ['sdk', 'python', 'api', 'release'],
  'github-claude-code': ['claude-code', 'cli', 'release'],
  'openai-news':        ['openai', 'news'],
  'openai-research':    ['openai', 'research'],
  'openai-github':      ['openai', 'sdk', 'release'],
  'sap-news':           ['sap', 'news'],
  'sap-community':      ['sap', 'community', 'blog'],
}

function buildTags(raw: RawItem, categoria: Categoria): string[] {
  const base = SOURCE_TAGS[raw.source] ?? []
  const extra = raw.tags ?? []
  const catTag = categoria.toLowerCase().replace(/\s+/g, '-')
  const combined = [catTag, ...base, ...extra]
  return combined.filter((v, i) => combined.indexOf(v) === i).slice(0, 8)
}

// ─── Resumen ─────────────────────────────────────────────────────────────────

function buildResumen(raw: RawItem): string {
  if (raw.summary && raw.summary.length >= 40) {
    return raw.summary.slice(0, 400)
  }
  // Extraer primera oración del contenido si hay
  if (raw.content) {
    const first = raw.content
      .replace(/^#+.*$/m, '')          // quitar headings
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')  // quitar negrita/cursiva
      .split(/\n\n|\.(?=\s)/)[0]
      .trim()
    if (first.length >= 40) return first.slice(0, 400)
  }
  return raw.title
}

// ─── Contenido ───────────────────────────────────────────────────────────────

function buildContenido(raw: RawItem): string {
  if (raw.content && raw.content.trim().length > 100) {
    return raw.content.trim()
  }
  // Contenido mínimo: resumen + enlace a fuente
  const resumen = buildResumen(raw)
  return `${resumen}\n\n[Leer artículo completo](${raw.url})`
}

// ─── Brand por fuente (backward compat) ──────────────────────────────────────

/** Para fuentes Anthropic, brand es siempre 'anthropic'; el resto se clasifica dinámicamente */
const ANTHROPIC_SOURCES: SourceId[] = ['anthropic-news', 'anthropic-research', 'github-sdk-python', 'github-claude-code']

function resolveBrand(raw: RawItem): Brand {
  if (ANTHROPIC_SOURCES.includes(raw.source)) return 'anthropic'
  // Para fuentes SAP, brand por defecto es 'sap'
  if (raw.source === 'sap-news' || raw.source === 'sap-community') return 'sap'
  // Clasificación dinámica para el resto
  return classifyBrand(raw)
}

// ─── Normalización principal ─────────────────────────────────────────────────

export function normalize(raw: RawItem): ContentEntry {
  const categoria = assignCategoria(raw)
  const slug = generateSlug(raw.title, raw.date)
  const resumen = buildResumen(raw)
  const brand: Brand = resolveBrand(raw)
  const tipo: ContentTipo = detectTipo(raw)

  return {
    id: generateId(raw.url),
    slug,
    status: 'published',
    published_at: new Date().toISOString(),
    source: raw.source,
    url_referencia: raw.url,
    fecha: raw.date,
    titulo: raw.title,
    resumen,
    contenido: buildContenido(raw),
    categoria,
    tags: buildTags(raw, categoria),
    imagen: raw.imagen,
    ingested_at: new Date().toISOString(),
    brand,
    tipo,
  }
}
