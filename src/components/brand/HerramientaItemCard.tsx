import type { HerramientaItem } from '@/lib/contenido'

interface HerramientaItemCardProps {
  herramienta: HerramientaItem
  accentClass: string
}

const ESTADO_LABELS: Record<string, string> = {
  experimental: 'Experimental',
  preview: 'Preview',
  beta: 'Beta',
  ga: 'Disponible',
}

const ESTADO_COLORS: Record<string, string> = {
  experimental: 'bg-amber-50 text-amber-700 border-amber-200',
  preview: 'bg-sky-50 text-sky-700 border-sky-200',
  beta: 'bg-violet-50 text-violet-700 border-violet-200',
  ga: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

/** Detect if a URL looks like a GitHub link */
function isGitHubUrl(url: string): boolean {
  return url.includes('github.com')
}

export default function HerramientaItemCard({ herramienta, accentClass }: HerramientaItemCardProps) {
  const estadoColor = ESTADO_COLORS[herramienta.estado] ?? ESTADO_COLORS.ga
  const estadoLabel = ESTADO_LABELS[herramienta.estado] ?? herramienta.estado
  const hasUrl = Boolean(herramienta.url_docs)
  const isGitHub = hasUrl && isGitHubUrl(herramienta.url_docs!)
  const linkLabel = isGitHub ? 'Ver en GitHub' : 'Ver documentación'

  const inner = (
    <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Accent top bar */}
      <div className={`absolute inset-x-0 top-0 h-0.5 ${accentClass}`} />

      {/* Header: name + status badge */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-zinc-900 group-hover:text-zinc-700 transition-colors">
          {herramienta.nombre}
        </h3>
        <span
          className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${estadoColor}`}
        >
          {estadoLabel}
        </span>
      </div>

      {/* Description — max 3 lines */}
      <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-500">
        {herramienta.descripcion}
      </p>

      {/* Tags */}
      {herramienta.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {herramienta.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer link */}
      {hasUrl && (
        <div className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition-colors group-hover:text-zinc-700">
          {isGitHub && (
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          )}
          {!isGitHub && (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          {linkLabel}
          <svg
            className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      )}
    </article>
  )

  if (hasUrl) {
    return (
      <a
        href={herramienta.url_docs}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full"
      >
        {inner}
      </a>
    )
  }

  return <div className="group block h-full">{inner}</div>
}
