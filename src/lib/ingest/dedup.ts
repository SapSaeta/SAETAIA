import type { ContentEntry, RawItem } from '@/types/ingest'

// ─── Normalización para comparación ─────────────────────────────────────────

function normalizeForCompare(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Similitud por solapamiento de palabras (Jaccard sobre palabras ≥ 4 chars) */
function titleSimilarity(a: string, b: string): number {
  const arrA = normalizeForCompare(a).split(' ').filter((w) => w.length >= 4)
  const arrB = normalizeForCompare(b).split(' ').filter((w) => w.length >= 4)
  const wordsA = new Set(arrA)
  const wordsB = new Set(arrB)
  if (wordsA.size === 0 || wordsB.size === 0) return 0

  const overlap = arrA.filter((w) => wordsB.has(w)).length
  const union = new Set(arrA.concat(arrB)).size
  return overlap / union
}

// ─── Índice de entradas existentes ──────────────────────────────────────────

export interface DedupIndex {
  urls: Set<string>
  slugs: Set<string>
  titles: string[]
}

export function buildDedupIndex(entries: ContentEntry[]): DedupIndex {
  return {
    urls: new Set(entries.map((e) => e.url_referencia)),
    slugs: new Set(entries.map((e) => e.slug)),
    titles: entries.map((e) => e.titulo),
  }
}

// ─── Comprobación de duplicados ──────────────────────────────────────────────

export type DuplicateReason = 'url' | 'slug' | 'title_similarity'

export interface DuplicateCheck {
  isDuplicate: boolean
  reason?: DuplicateReason
  similarity?: number
}

const SIMILARITY_THRESHOLD = 0.65

export function checkDuplicate(
  raw: RawItem,
  slug: string,
  index: DedupIndex
): DuplicateCheck {
  // 1. URL exacta
  if (index.urls.has(raw.url)) {
    return { isDuplicate: true, reason: 'url' }
  }

  // 2. Slug exacto
  if (index.slugs.has(slug)) {
    return { isDuplicate: true, reason: 'slug' }
  }

  // 3. Similitud de título
  for (const existingTitle of index.titles) {
    const sim = titleSimilarity(raw.title, existingTitle)
    if (sim >= SIMILARITY_THRESHOLD) {
      return { isDuplicate: true, reason: 'title_similarity', similarity: sim }
    }
  }

  return { isDuplicate: false }
}
