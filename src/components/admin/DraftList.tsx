'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { ContentEntry } from '@/types/ingest'
import { CATEGORIA_COLORS } from '@/data/categorias'
import { formatFechaCorta } from '@/lib/utils'
import { cn } from '@/lib/utils'

const SOURCE_LABEL: Record<string, string> = {
  'anthropic-news': 'Anthropic News',
  'anthropic-research': 'Anthropic Research',
  'github-sdk-python': 'GitHub SDK Python',
  'github-claude-code': 'GitHub Claude Code',
}

interface DraftCardProps {
  entry: ContentEntry
  onAction: (slug: string, action: 'publish' | 'reject') => Promise<void>
}

function DraftCard({ entry, onAction }: DraftCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [actionType, setActionType] = useState<'publish' | 'reject' | null>(null)
  const [error, setError] = useState('')

  const colors = CATEGORIA_COLORS[entry.categoria]

  function handleAction(action: 'publish' | 'reject') {
    setError('')
    setActionType(action)
    startTransition(async () => {
      try {
        await onAction(entry.slug, action)
      } catch (e) {
        setError((e as Error).message)
        setActionType(null)
      }
    })
  }

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      {/* Header */}
      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={cn(
            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
            colors.bg, colors.text, colors.border
          )}>
            {entry.categoria}
          </span>
          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-500">
            {SOURCE_LABEL[entry.source] ?? entry.source}
          </span>
          <time className="ml-auto text-xs text-zinc-400">
            {formatFechaCorta(entry.fecha)}
          </time>
        </div>

        <h2 className="mb-2 text-base font-semibold leading-snug text-zinc-900">
          {entry.titulo}
        </h2>

        <p className="mb-3 text-sm leading-relaxed text-zinc-500 line-clamp-2">
          {entry.resumen}
        </p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-1">
          {entry.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-zinc-100 bg-zinc-50 px-1.5 py-0.5 text-[11px] text-zinc-400">
              {tag}
            </span>
          ))}
        </div>

        {/* URL fuente */}
        <a
          href={entry.url_referencia}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 flex items-center gap-1 truncate text-xs text-zinc-400 hover:text-violet-600"
        >
          <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          <span className="truncate">{entry.url_referencia}</span>
        </a>

        {/* Expandir contenido */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mb-4 flex items-center gap-1 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-600"
        >
          <svg
            className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-180')}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          {expanded ? 'Ocultar contenido' : 'Ver contenido completo'}
        </button>

        {expanded && (
          <pre className="mb-4 max-h-64 overflow-y-auto rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-600 whitespace-pre-wrap font-mono">
            {entry.contenido}
          </pre>
        )}

        {/* Acciones */}
        {error && (
          <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => handleAction('publish')}
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending && actionType === 'publish' ? (
              <>
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Publicando…
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Publicar
              </>
            )}
          </button>

          <button
            onClick={() => handleAction('reject')}
            disabled={isPending}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending && actionType === 'reject' ? (
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            Rechazar
          </button>
        </div>
      </div>
    </article>
  )
}

interface DraftListProps {
  drafts: ContentEntry[]
}

export default function DraftList({ drafts: initialDrafts }: DraftListProps) {
  const router = useRouter()
  const [drafts, setDrafts] = useState(initialDrafts)
  const [feedback, setFeedback] = useState<{ slug: string; action: string } | null>(null)

  async function handleAction(slug: string, action: 'publish' | 'reject') {
    const res = await fetch(`/api/admin/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error ?? `Error al ${action === 'publish' ? 'publicar' : 'rechazar'}`)
    }

    setDrafts((prev) => prev.filter((d) => d.slug !== slug))
    setFeedback({ slug, action })
    setTimeout(() => setFeedback(null), 3000)
    router.refresh()
  }

  return (
    <div>
      {/* Feedback toast */}
      {feedback && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span>
            <strong>{feedback.slug}</strong> {feedback.action === 'publish' ? 'publicado correctamente' : 'rechazado'}.
            {feedback.action === 'publish' && ' Haz git push para que aparezca en el sitio.'}
          </span>
        </div>
      )}

      {drafts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-20 text-center">
          <svg className="mb-3 h-8 w-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-zinc-500">No hay borradores pendientes</p>
          <p className="mt-1 text-xs text-zinc-400">Ejecuta el ingest para obtener nuevas noticias</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {drafts.map((draft) => (
            <DraftCard key={draft.slug} entry={draft} onAction={handleAction} />
          ))}
        </div>
      )}
    </div>
  )
}
