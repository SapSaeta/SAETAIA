/**
 * openai-tools.ts
 * Fuente de herramientas OpenAI: releases de GitHub de los repos clave.
 *  - openai/openai-python     — Python SDK
 *  - openai/openai-node       — Node.js SDK
 *  - openai/openai-agents-python — Agents SDK
 *
 * Reutiliza el patrón de makeGithubReleasesSource de github-releases.ts.
 * Source ID combinado: 'openai-github'
 */

import type { Source } from './types'
import type { RawItem, SourceResult } from '@/types/ingest'
import { cutoffDate } from './utils'

const SOURCE_ID = 'openai-github' as const
const LOOKBACK_DAYS = 60

interface GithubRelease {
  id: number
  tag_name: string
  name: string | null
  body: string | null
  published_at: string
  html_url: string
  prerelease: boolean
  draft: boolean
}

const OPENAI_REPOS = [
  { owner: 'openai', repo: 'openai-python',        displayName: 'OpenAI Python SDK' },
  { owner: 'openai', repo: 'openai-node',           displayName: 'OpenAI Node.js SDK' },
  { owner: 'openai', repo: 'openai-agents-python',  displayName: 'OpenAI Agents SDK' },
] as const

// ─── GitHub API helper ────────────────────────────────────────────────────────

async function fetchReleases(owner: string, repo: string): Promise<GithubRelease[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=15`
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'SaetaIA-Ingest/1.0',
  }
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  const res = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(12_000),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`GitHub API ${owner}/${repo} → HTTP ${res.status}: ${body.slice(0, 200)}`)
  }
  return res.json() as Promise<GithubRelease[]>
}

function releaseToRawItem(
  release: GithubRelease,
  displayName: string
): RawItem {
  const title = `${displayName} ${release.tag_name}${
    release.name && release.name !== release.tag_name ? ` — ${release.name}` : ''
  }`
  const date = release.published_at.split('T')[0]
  const content = release.body ?? ''
  const summary =
    content.split('\n').find((l) => l.trim().length > 20)?.replace(/^#+\s*/, '').trim() ?? title

  return {
    source: SOURCE_ID,
    url: release.html_url,
    title,
    date,
    summary: summary.slice(0, 300),
    content,
    tags: ['release', 'changelog', 'sdk', 'openai'],
  }
}

// ─── Fuente combinada OpenAI GitHub ──────────────────────────────────────────

/**
 * Fuente que agrega releases de todos los repositorios clave de OpenAI.
 * Filtra drafts, prereleases y artículos más antiguos que LOOKBACK_DAYS.
 */
export const openaiToolsSource: Source = {
  id: SOURCE_ID,
  name: 'OpenAI GitHub Releases',
  baseUrl: 'https://github.com/openai',

  async fetch(): Promise<SourceResult> {
    const fetched_at = new Date().toISOString()
    const cutoff = cutoffDate(LOOKBACK_DAYS)
    const allItems: RawItem[] = []
    const errors: string[] = []

    for (const { owner, repo, displayName } of OPENAI_REPOS) {
      try {
        const releases = await fetchReleases(owner, repo)
        const filtered = releases
          .filter((r) => !r.draft && !r.prerelease)
          .filter((r) => r.published_at.split('T')[0] >= cutoff)
          .map((r) => releaseToRawItem(r, displayName))
        allItems.push(...filtered)
      } catch (err) {
        errors.push(err instanceof Error ? err.message : String(err))
      }
    }

    // Ordenar por fecha descendente
    allItems.sort((a, b) => (a.date < b.date ? 1 : -1))

    return {
      source: SOURCE_ID,
      items: allItems,
      error: errors.length > 0 ? errors.join(' | ') : undefined,
      fetched_at,
    }
  },
}
