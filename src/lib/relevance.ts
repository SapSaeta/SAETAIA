/**
 * relevance.ts
 * Algoritmo avanzado de scoring y clasificación de artículos para SaetaIA.
 *
 * Evalúa la relevancia de cada RawItem en base a:
 *  1. Brand detection     (0–35 pts)
 *  2. AI/Tech relevance   (0–25 pts)
 *  3. Tipo de contenido   (0–20 pts)
 *  4. Recencia            (0–10 pts)
 *  5. Calidad del contenido (0–10 pts)
 *
 * Total máximo: 100 pts.
 */

import type { RawItem } from '@/types/ingest'

// ─── Tipos públicos ──────────────────────────────────────────────────────────

export interface RelevanceScore {
  /** Puntuación total 0–100 */
  score: number
  /** Marca principal detectada */
  brand: 'anthropic' | 'sap' | 'openai' | 'general'
  /** Tipo de contenido detectado */
  tipo: 'noticia' | 'herramienta'
  /** true si score >= umbral (configurable, default 40) */
  isRelevant: boolean
  /** Razones que explican el scoring */
  reasons: string[]
}

// ─── Constantes internas ─────────────────────────────────────────────────────

const DEFAULT_THRESHOLD = 40

/** Dos años en días */
const MAX_AGE_DAYS = 730

// Keywords por brand (todo en minúsculas para comparación)
const BRAND_KEYWORDS: Record<'anthropic' | 'sap' | 'openai', string[]> = {
  anthropic: [
    'anthropic', 'claude', 'opus', 'sonnet', 'haiku',
    'constitutional ai', 'mcp protocol',
  ],
  openai: [
    'openai', 'chatgpt', 'gpt-4', 'gpt-5', 'gpt4', 'gpt5',
    'o1', 'o3', 'sora', 'dall-e', 'dalle', 'whisper', 'operator',
  ],
  sap: [
    'sap', 's/4hana', 's4hana', 'business technology platform',
    'btp', 'fiori', 'rise with sap', 'joule', 'erp', 'business ai',
  ],
}

// Puntos máximos por sección
const MAX_BRAND   = 35
const MAX_AI      = 25
const MAX_TIPO    = 20
const MAX_RECENCY = 10
const MAX_QUALITY = 10

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Devuelve un texto único combinando los campos relevantes del ítem */
function buildSearchText(raw: RawItem): string {
  return [
    raw.title ?? '',
    raw.summary ?? '',
    raw.content ?? '',
    raw.url ?? '',
    ...(raw.tags ?? []),
  ]
    .join(' ')
    .toLowerCase()
}

/** Días de diferencia entre una fecha ISO y hoy */
function daysAgo(dateStr: string): number {
  if (!dateStr) return MAX_AGE_DAYS + 1
  const published = new Date(dateStr)
  if (isNaN(published.getTime())) return MAX_AGE_DAYS + 1
  const now = new Date()
  return Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24))
}

// ─── Sub-scorers ─────────────────────────────────────────────────────────────

interface BrandResult {
  brand: 'anthropic' | 'sap' | 'openai' | 'general'
  score: number
  reasons: string[]
}

/**
 * Detecta la marca y asigna hasta 35 puntos.
 * Gana la marca con más coincidencias ponderadas.
 */
function scoreBrand(text: string): BrandResult {
  const counts: Record<'anthropic' | 'sap' | 'openai', number> = {
    anthropic: 0,
    openai: 0,
    sap: 0,
  }
  const matched: Record<'anthropic' | 'sap' | 'openai', string[]> = {
    anthropic: [],
    openai: [],
    sap: [],
  }

  for (const [brand, keywords] of Object.entries(BRAND_KEYWORDS) as Array<['anthropic' | 'sap' | 'openai', string[]]>) {
    for (const kw of keywords) {
      if (text.includes(kw)) {
        counts[brand]++
        matched[brand].push(kw)
      }
    }
  }

  // Determinar brand ganador
  const total = counts.anthropic + counts.openai + counts.sap
  if (total === 0) {
    return { brand: 'general', score: 0, reasons: [] }
  }

  let winnerBrand: 'anthropic' | 'sap' | 'openai' = 'anthropic'
  let winnerCount = 0
  for (const b of ['anthropic', 'openai', 'sap'] as const) {
    if (counts[b] > winnerCount) {
      winnerCount = counts[b]
      winnerBrand = b
    }
  }

  // Puntuación: 15 pts por primera coincidencia + 10 pts si 2+ coincidencias + 10 pts si 3+
  let score = 0
  if (winnerCount >= 1) score += 15
  if (winnerCount >= 2) score += 10
  if (winnerCount >= 3) score += 10
  score = Math.min(score, MAX_BRAND)

  const reasons = [`brand:${winnerBrand} (keywords: ${matched[winnerBrand].join(', ')})`]
  return { brand: winnerBrand, score, reasons }
}

interface SectionResult {
  score: number
  reasons: string[]
}

/** Relevancia AI/Tech: hasta 25 puntos */
function scoreAiTech(text: string): SectionResult {
  const highKw = [
    'llm', 'large language model', 'generative ai', 'foundation model',
    'ai agent', 'rag', 'fine-tuning', 'finetuning', 'fine tuning',
    'retrieval augmented', 'multimodal', 'reasoning model',
  ]
  const midKw = [
    'machine learning', 'neural network', 'transformer', 'embedding',
    'vector database', 'vector store', 'diffusion model', 'language model',
  ]
  const baseKw = [
    'artificial intelligence', 'automation', 'digital transformation',
    'cloud ai', 'ai-powered', 'ai powered', 'deep learning',
  ]

  let score = 0
  const reasons: string[] = []

  for (const kw of highKw) {
    if (text.includes(kw)) {
      score = Math.max(score, 20)
      reasons.push(`ai-high:${kw}`)
    }
  }
  for (const kw of midKw) {
    if (text.includes(kw)) {
      score = Math.max(score, 10)
      reasons.push(`ai-mid:${kw}`)
    }
  }
  for (const kw of baseKw) {
    if (text.includes(kw)) {
      score = Math.max(score, 5)
      reasons.push(`ai-base:${kw}`)
    }
  }

  // Bonus por densidad: múltiples categorías detectadas
  const cats = [
    highKw.some((k) => text.includes(k)),
    midKw.some((k) => text.includes(k)),
    baseKw.some((k) => text.includes(k)),
  ].filter(Boolean).length
  if (cats >= 2) score = Math.min(score + 5, MAX_AI)

  return { score: Math.min(score, MAX_AI), reasons: reasons.slice(0, 3) }
}

/** Tipo de contenido: hasta 20 puntos, retorna score y tipo detectado */
function scoreTipo(text: string): SectionResult & { tipo: 'noticia' | 'herramienta' } {
  const toolKw = [
    'sdk', 'api', 'tool', 'plugin', 'release', 'library', 'framework',
    'integration', 'connector', 'extension', 'feature launch', 'cli',
    'package', 'module', 'client', 'endpoint',
  ]
  const toolRegex = /v\d+\.\d+/

  const newsKw = [
    'announces', 'launches', 'study', 'research', 'report',
    'partnership', 'funding', 'policy', 'blog', 'news', 'update',
    'collaboration', 'acquisition', 'investment',
  ]

  const toolMatches = toolKw.filter((k) => text.includes(k)).length + (toolRegex.test(text) ? 2 : 0)
  const newsMatches = newsKw.filter((k) => text.includes(k)).length

  let tipo: 'noticia' | 'herramienta'
  let score = 0
  const reasons: string[] = []

  if (toolMatches > newsMatches) {
    tipo = 'herramienta'
    score = toolMatches >= 3 ? 20 : toolMatches >= 2 ? 15 : 10
    reasons.push(`tipo:herramienta (tool-matches:${toolMatches})`)
  } else {
    tipo = 'noticia'
    score = newsMatches >= 3 ? 20 : newsMatches >= 2 ? 15 : newsMatches >= 1 ? 10 : 5
    reasons.push(`tipo:noticia (news-matches:${newsMatches})`)
  }

  return { score: Math.min(score, MAX_TIPO), tipo, reasons }
}

/** Recencia: hasta 10 puntos */
function scoreRecency(dateStr: string): SectionResult {
  const days = daysAgo(dateStr)
  let score = 0
  let reason = ''

  if (days <= 30) {
    score = 10
    reason = `recency:last-30-days (${days}d ago)`
  } else if (days <= 90) {
    score = 7
    reason = `recency:31-90-days (${days}d ago)`
  } else if (days <= 180) {
    score = 4
    reason = `recency:91-180-days (${days}d ago)`
  } else {
    score = 1
    reason = `recency:>180-days (${days}d ago)`
  }

  return { score, reasons: [reason] }
}

/** Calidad del contenido: hasta 10 puntos */
function scoreQuality(raw: RawItem): SectionResult {
  let score = 0
  const reasons: string[] = []

  if (raw.imagen) {
    score += 3
    reasons.push('quality:has-image')
  }
  if (raw.summary && raw.summary.length > 100) {
    score += 3
    reasons.push(`quality:summary-${raw.summary.length}chars`)
  }
  const titleLen = (raw.title ?? '').length
  if (titleLen >= 20 && titleLen <= 120) {
    score += 2
    reasons.push(`quality:title-${titleLen}chars`)
  }
  // URL de fuente oficial: dominio reconocido
  const officialDomains = [
    'anthropic.com', 'openai.com', 'sap.com', 'community.sap.com',
    'news.sap.com', 'github.com',
  ]
  if (officialDomains.some((d) => (raw.url ?? '').includes(d))) {
    score += 2
    reasons.push('quality:official-domain')
  }

  return { score: Math.min(score, MAX_QUALITY), reasons }
}

// ─── Funciones públicas ───────────────────────────────────────────────────────

/**
 * Clasifica el brand principal de un RawItem.
 * @param raw - Ítem crudo de la fuente
 * @returns Brand detectada
 */
export function classifyBrand(raw: RawItem): 'anthropic' | 'sap' | 'openai' | 'general' {
  if (!raw) return 'general'
  const text = buildSearchText(raw)
  return scoreBrand(text).brand
}

/**
 * Detecta el tipo de contenido de un RawItem.
 * @param raw - Ítem crudo de la fuente
 * @returns 'herramienta' o 'noticia'
 */
export function detectTipo(raw: RawItem): 'noticia' | 'herramienta' {
  if (!raw) return 'noticia'
  const text = buildSearchText(raw)
  return scoreTipo(text).tipo
}

/**
 * Calcula una puntuación de relevancia completa para un RawItem.
 *
 * @param raw - Ítem crudo de la fuente
 * @param threshold - Umbral de relevancia (default 40)
 * @returns RelevanceScore con puntuación, clasificaciones y razones
 */
export function scoreArticle(raw: RawItem, threshold = DEFAULT_THRESHOLD): RelevanceScore {
  // Guard: inputs vacíos o malformados
  if (!raw || !raw.url) {
    return {
      score: 0,
      brand: 'general',
      tipo: 'noticia',
      isRelevant: false,
      reasons: ['excluded:missing-url-or-item'],
    }
  }

  // Filtro: título < 10 chars
  const titleLen = (raw.title ?? '').trim().length
  if (titleLen < 10) {
    return {
      score: 0,
      brand: 'general',
      tipo: 'noticia',
      isRelevant: false,
      reasons: [`excluded:title-too-short (${titleLen} chars)`],
    }
  }

  // Filtro: artículo de más de 2 años
  const days = daysAgo(raw.date)
  if (days > MAX_AGE_DAYS) {
    return {
      score: 0,
      brand: 'general',
      tipo: 'noticia',
      isRelevant: false,
      reasons: [`excluded:too-old (${days} days ago)`],
    }
  }

  const text = buildSearchText(raw)

  const brandResult  = scoreBrand(text)
  const aiResult     = scoreAiTech(text)
  const tipoResult   = scoreTipo(text)
  const recencyResult = scoreRecency(raw.date)
  const qualityResult = scoreQuality(raw)

  // Filtro: sin brand Y sin relevancia AI
  if (brandResult.score === 0 && aiResult.score === 0) {
    return {
      score: 0,
      brand: 'general',
      tipo: tipoResult.tipo,
      isRelevant: false,
      reasons: ['excluded:no-brand-and-no-ai-relevance'],
    }
  }

  const total = Math.min(
    100,
    brandResult.score +
    aiResult.score +
    tipoResult.score +
    recencyResult.score +
    qualityResult.score
  )

  const allReasons = [
    ...brandResult.reasons,
    ...aiResult.reasons,
    ...tipoResult.reasons,
    ...recencyResult.reasons,
    ...qualityResult.reasons,
    `total:${total}`,
  ]

  return {
    score: total,
    brand: brandResult.brand,
    tipo: tipoResult.tipo,
    isRelevant: total >= threshold,
    reasons: allReasons,
  }
}
