import type { Source } from './types'
import type { RawItem, SourceId, SourceResult } from '@/types/ingest'
import { cutoffDate } from './utils'

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

const REPOS: Array<{ owner: string; repo: string; sourceId: SourceId; displayName: string }> = [
  {
    owner: 'anthropics',
    repo: 'anthropic-sdk-python',
    sourceId: 'github-sdk-python',
    displayName: 'Anthropic Python SDK',
  },
  {
    owner: 'anthropics',
    repo: 'claude-code',
    sourceId: 'github-claude-code',
    displayName: 'Claude Code',
  },
]

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

function releaseToRawItem(release: GithubRelease, sourceId: SourceId, displayName: string): RawItem {
  const title = `${displayName} ${release.tag_name}${release.name && release.name !== release.tag_name ? ` — ${release.name}` : ''}`
  const date = release.published_at.split('T')[0]
  // GitHub release body is already Markdown — usable directly as contenido
  const content = release.body ?? ''
  // First paragraph as summary
  const summary = content.split('\n').find((l) => l.trim().length > 20)?.replace(/^#+\s*/, '').trim() ?? title

  return {
    source: sourceId,
    url: release.html_url,
    title,
    date,
    summary: summary.slice(0, 300),
    content,
    tags: ['release', 'changelog', 'sdk'],
  }
}

/** Fuente combinada para todos los repositorios de GitHub */
export function makeGithubReleasesSource(
  owner: string,
  repo: string,
  sourceId: SourceId,
  displayName: string
): Source {
  const LOOKBACK_DAYS = 60

  return {
    id: sourceId,
    name: `GitHub: ${displayName}`,
    baseUrl: `https://github.com/${owner}/${repo}`,

    async fetch(): Promise<SourceResult> {
      const fetched_at = new Date().toISOString()
      try {
        const releases = await fetchReleases(owner, repo)
        const cutoff = cutoffDate(LOOKBACK_DAYS)

        const items = releases
          .filter((r) => !r.draft && !r.prerelease)
          .filter((r) => r.published_at.split('T')[0] >= cutoff)
          .map((r) => releaseToRawItem(r, sourceId, displayName))

        return { source: sourceId, items, fetched_at }
      } catch (error) {
        return {
          source: sourceId,
          items: [],
          error: error instanceof Error ? error.message : String(error),
          fetched_at,
        }
      }
    },
  }
}

export const githubSources: Source[] = REPOS.map(({ owner, repo, sourceId, displayName }) =>
  makeGithubReleasesSource(owner, repo, sourceId, displayName)
)
