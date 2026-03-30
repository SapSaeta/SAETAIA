/**
 * drafts.ts — Lectura de borradores para el panel de administración.
 *
 * - LOCAL: lee content/noticias/*.json directamente del filesystem.
 * - VERCEL: usa la GitHub Contents API para leer los archivos del repo.
 */

import type { ContentEntry } from '@/types/ingest'

const IS_VERCEL = process.env.VERCEL === '1'

// ─── Local ───────────────────────────────────────────────────────────────────

async function getDraftsLocal(): Promise<ContentEntry[]> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require('fs') as typeof import('fs')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require('path') as typeof import('path')
  const dir = path.join(process.cwd(), 'content', 'noticias')
  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir).filter((f: string) => f.endsWith('.json'))
  const entries: ContentEntry[] = []

  for (const file of files) {
    try {
      const entry = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8')) as ContentEntry
      if (entry.status === 'draft') entries.push(entry)
    } catch { /* saltar archivos malformados */ }
  }

  return entries.sort((a, b) => b.fecha.localeCompare(a.fecha))
}

// ─── GitHub API (Vercel) ─────────────────────────────────────────────────────

interface GithubFile {
  name: string
  download_url: string
  type: string
}

async function getDraftsGitHub(): Promise<ContentEntry[]> {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH ?? 'main'

  if (!token || !repo) {
    throw new Error('GITHUB_TOKEN y GITHUB_REPO requeridos para leer borradores en Vercel')
  }

  const listRes = await fetch(
    `https://api.github.com/repos/${repo}/contents/content/noticias?ref=${branch}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
      cache: 'no-store',
    }
  )

  if (listRes.status === 404) return []   // carpeta aún no existe
  if (!listRes.ok) throw new Error(`GitHub API: HTTP ${listRes.status}`)

  const files = (await listRes.json()) as GithubFile[]
  const jsonFiles = files.filter((f) => f.type === 'file' && f.name.endsWith('.json'))

  const entries: ContentEntry[] = []
  for (const file of jsonFiles) {
    try {
      const res = await fetch(file.download_url, { cache: 'no-store' })
      const entry = (await res.json()) as ContentEntry
      if (entry.status === 'draft') entries.push(entry)
    } catch { /* non-fatal */ }
  }

  return entries.sort((a, b) => b.fecha.localeCompare(a.fecha))
}

// ─── API pública ─────────────────────────────────────────────────────────────

export async function getDraftEntries(): Promise<ContentEntry[]> {
  if (IS_VERCEL) return getDraftsGitHub()
  return getDraftsLocal()
}
