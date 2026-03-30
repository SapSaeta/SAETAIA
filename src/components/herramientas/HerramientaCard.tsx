import Link from 'next/link'
import { Herramienta, HerramientaEstado } from '@/types'

const ESTADO_STYLES: Record<HerramientaEstado, { label: string; className: string }> = {
  ga: { label: 'Disponible', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  beta: { label: 'Beta', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  preview: { label: 'Preview', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  experimental: { label: 'Experimental', className: 'bg-violet-50 text-violet-700 border-violet-200' },
}

const CATEGORIA_DOT: Record<string, string> = {
  Agentes: 'bg-violet-400',
  Codificación: 'bg-blue-400',
  Integración: 'bg-emerald-400',
  Interfaz: 'bg-amber-400',
  Datos: 'bg-rose-400',
}

interface HerramientaCardProps {
  herramienta: Herramienta
}

export default function HerramientaCard({ herramienta }: HerramientaCardProps) {
  const estado = ESTADO_STYLES[herramienta.estado]
  const dotColor = CATEGORIA_DOT[herramienta.categoria] ?? 'bg-zinc-400'

  return (
    <Link href={`/herramientas/${herramienta.slug}`} className="group block">
      <article className="h-full rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex flex-col gap-3">
          {/* Estado + categoría */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${estado.className}`}
            >
              {estado.label}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
              {herramienta.categoria}
            </span>
          </div>

          {/* Nombre */}
          <h2 className="text-sm font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-violet-700">
            {herramienta.nombre}
          </h2>

          {/* Descripción */}
          <p className="text-xs leading-relaxed text-zinc-400 line-clamp-3">
            {herramienta.descripcion}
          </p>

          {/* Compatible con */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {herramienta.compatible_con.slice(0, 3).map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full bg-zinc-50 px-2 py-0.5 text-xs text-zinc-500 border border-zinc-200"
              >
                {c}
              </span>
            ))}
            {herramienta.compatible_con.length > 3 && (
              <span className="text-xs text-zinc-600">
                +{herramienta.compatible_con.length - 3}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
