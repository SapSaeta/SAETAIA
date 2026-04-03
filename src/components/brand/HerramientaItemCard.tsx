import Link from 'next/link'
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
  preview: 'bg-blue-50 text-blue-700 border-blue-200',
  beta: 'bg-violet-50 text-violet-700 border-violet-200',
  ga: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export default function HerramientaItemCard({ herramienta, accentClass }: HerramientaItemCardProps) {
  const estadoColor = ESTADO_COLORS[herramienta.estado] ?? ESTADO_COLORS.ga
  const estadoLabel = ESTADO_LABELS[herramienta.estado] ?? herramienta.estado

  const CardWrapper = ({ children }: { children: React.ReactNode }) =>
    herramienta.url_docs ? (
      <a
        href={herramienta.url_docs}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full"
      >
        {children}
      </a>
    ) : (
      <div className="group block h-full">{children}</div>
    )

  return (
    <CardWrapper>
      <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        {/* Accent top bar */}
        <div className={`absolute inset-x-0 top-0 h-0.5 ${accentClass}`} />

        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 group-hover:text-zinc-700 transition-colors">
            {herramienta.nombre}
          </h3>
          <span
            className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${estadoColor}`}
          >
            {estadoLabel}
          </span>
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 flex-1 text-xs leading-relaxed text-zinc-500">
          {herramienta.descripcion}
        </p>

        {/* Tags */}
        {herramienta.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {herramienta.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer link */}
        {herramienta.url_docs && (
          <div className="mt-auto flex items-center gap-1 text-xs font-medium text-zinc-400 transition-colors group-hover:text-zinc-600">
            Ver documentación
            <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        )}
      </article>
    </CardWrapper>
  )
}
