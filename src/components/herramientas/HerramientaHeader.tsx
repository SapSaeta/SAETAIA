import { Herramienta, HerramientaEstado } from '@/types'
import { formatFecha } from '@/lib/utils'

const ESTADO_STYLES: Record<HerramientaEstado, { label: string; className: string }> = {
  ga: { label: 'Disponible', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  beta: { label: 'Beta', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  preview: { label: 'Preview', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  experimental: { label: 'Experimental', className: 'bg-violet-50 text-violet-700 border-violet-200' },
}

interface HerramientaHeaderProps {
  herramienta: Herramienta
}

export default function HerramientaHeader({ herramienta }: HerramientaHeaderProps) {
  const estado = ESTADO_STYLES[herramienta.estado]

  return (
    <div className="space-y-4 border-b border-zinc-200 pb-8">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${estado.className}`}
        >
          {estado.label}
        </span>
        <span className="text-xs text-zinc-500">{herramienta.categoria}</span>
        <span className="text-xs text-zinc-600">·</span>
        <time className="text-xs text-zinc-500" dateTime={herramienta.fecha_lanzamiento}>
          Lanzado el {formatFecha(herramienta.fecha_lanzamiento)}
        </time>
      </div>

      <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">{herramienta.nombre}</h1>

      <p className="text-base leading-relaxed text-zinc-500">{herramienta.descripcion}</p>

      {/* Compatible con */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Compatible con</p>
        <div className="flex flex-wrap gap-2">
          {herramienta.compatible_con.map((c) => (
            <span
              key={c}
              className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-600"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Tags */}
      {herramienta.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {herramienta.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Links */}
      <div className="flex flex-wrap gap-3 pt-1">
        {herramienta.url_docs && (
          <a
            href={herramienta.url_docs}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-violet-600 transition-colors hover:text-violet-700"
          >
            Documentación →
          </a>
        )}
        {herramienta.url_repo && (
          <a
            href={herramienta.url_repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 transition-colors hover:text-zinc-700"
          >
            Repositorio →
          </a>
        )}
      </div>
    </div>
  )
}
