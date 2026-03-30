/**
 * store.ts — Capa de persistencia para entradas ingestadas.
 *
 * - LOCAL (desarrollo):  lee/escribe content/noticias/*.json directamente en el filesystem.
 * - VERCEL (producción): usa la GitHub Contents API para crear/actualizar archivos en el repo,
 *   lo que desencadena un redeploy automático de Vercel.
 *
 * La detección es automática: si VERCEL=1 en el entorno, se usa GitHub API.
 * Requiere las variables GITHUB_TOKEN, GITHUB_REPO y GITHUB_BRANCH (default: main).
 */

import type { ContentEntry } from '@/types/ingest'

const IS_VERCEL = process.env.VERCEL === '1'

// ─── Helpers GitHub API ──────────────────────────────────────────────────────

interface GithubFileResponse {
  sha?: string
  content?: string
}

async function githubRequest(
  path: string,
  method: 'GET' | 'PUT',
  body?: unknown
): Promise<Response> {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO
  if (!token || !repo) {
    throw new Error(
      'Variables GITHUB_TOKEN y GITHUB_REPO requeridas en Vercel. Ver .env.example'
    )
  }

  const url = `https://api.github.com/repos/${repo}/contents/${path}`
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'SaetaIA-Ingest/1.0',
  }
  if (body) headers['Content-Type'] = 'application/json'

  return fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15_000),
  })
}

async function saveEntryGitHub(entry: ContentEntry): Promise<void> {
  const branch = process.env.GITHUB_BRANCH ?? 'main'
  const filePath = `content/noticias/${entry.slug}.json`
  const fileContent = JSON.stringify(entry, null, 2)
  const encoded = Buffer.from(fileContent).toString('base64')

  // Comprobar si ya existe (para obtener el sha necesario en actualizaciones)
  const checkRes = await githubRequest(`${filePath}?ref=${branch}`, 'GET')
  let sha: string | undefined
  if (checkRes.ok) {
    const data = (await checkRes.json()) as GithubFileResponse
    sha = data.sha
  }

  const putRes = await githubRequest(filePath, 'PUT', {
    message: `ingest: ${entry.status} — ${entry.slug}`,
    content: encoded,
    branch,
    ...(sha ? { sha } : {}),
  })

  if (!putRes.ok) {
    const err = await putRes.text().catch(() => '')
    throw new Error(`GitHub PUT ${filePath} → HTTP ${putRes.status}: ${err.slice(0, 300)}`)
  }
}

// ─── Helpers filesystem local ────────────────────────────────────────────────

async function getFs() {
  // Dynamic import para que Next.js no intente bundlear fs en cliente
  const fs = await import('fs')
  const path = await import('path')
  return { fs, path }
}

async function getContentDir(): Promise<string> {
  const { path } = await getFs()
  return path.join(process.cwd(), 'content', 'noticias')
}

async function saveEntryLocal(entry: ContentEntry): Promise<void> {
  const { fs, path } = await getFs()
  const dir = await getContentDir()
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const filePath = path.join(dir, `${entry.slug}.json`)
  fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), 'utf-8')
}

// ─── API pública ─────────────────────────────────────────────────────────────

/** Lee todas las entradas del filesystem local (solo en build / desarrollo) */
export async function getAllStoredEntries(): Promise<ContentEntry[]> {
  if (IS_VERCEL) return []   // En runtime Vercel, el FS es read-only — leer desde build context
  try {
    const { fs, path } = await getFs()
    const dir = await getContentDir()
    if (!fs.existsSync(dir)) return []

    const files = fs.readdirSync(dir).filter((f: string) => f.endsWith('.json'))
    const entries: ContentEntry[] = []

    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
        entries.push(JSON.parse(raw) as ContentEntry)
      } catch { /* saltar archivos malformados */ }
    }
    return entries
  } catch {
    return []
  }
}

/** Persiste una entrada. En Vercel usa GitHub API; localmente usa el FS */
export async function saveEntry(entry: ContentEntry): Promise<void> {
  if (IS_VERCEL) {
    await saveEntryGitHub(entry)
  } else {
    await saveEntryLocal(entry)
  }
}

// ─── Actualización de estado (publish / reject) ──────────────────────────────

async function updateEntryStatusGitHub(
  slug: string,
  status: 'published' | 'rejected'
): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH ?? 'main'
  if (!token || !repo) throw new Error('GITHUB_TOKEN y GITHUB_REPO requeridos')

  const filePath = `content/noticias/${slug}.json`
  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`,
    { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' } }
  )
  if (!res.ok) return false

  const fileData = (await res.json()) as { sha: string; content: string }
  const entry = JSON.parse(
    Buffer.from(fileData.content.replace(/\n/g, ''), 'base64').toString('utf-8')
  ) as ContentEntry

  entry.status = status
  if (status === 'published') entry.published_at = new Date().toISOString()

  const putRes = await githubRequest(filePath, 'PUT', {
    message: `${status}: ${slug}`,
    content: Buffer.from(JSON.stringify(entry, null, 2)).toString('base64'),
    sha: fileData.sha,
    branch,
  })
  return putRes.ok
}

async function updateEntryStatusLocal(
  slug: string,
  status: 'published' | 'rejected'
): Promise<boolean> {
  try {
    const { fs, path } = await getFs()
    const dir = await getContentDir()
    const filePath = path.join(dir, `${slug}.json`)
    if (!fs.existsSync(filePath)) return false

    const entry = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as ContentEntry
    entry.status = status
    if (status === 'published') entry.published_at = new Date().toISOString()
    fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), 'utf-8')
    return true
  } catch {
    return false
  }
}

/** Cambia una entrada a 'published' */
export async function publishEntry(slug: string): Promise<boolean> {
  if (IS_VERCEL) return updateEntryStatusGitHub(slug, 'published')
  return updateEntryStatusLocal(slug, 'published')
}

/** Cambia una entrada a 'rejected' (la conserva pero la oculta del sitio) */
export async function rejectEntry(slug: string): Promise<boolean> {
  if (IS_VERCEL) return updateEntryStatusGitHub(slug, 'rejected')
  return updateEntryStatusLocal(slug, 'rejected')
}
