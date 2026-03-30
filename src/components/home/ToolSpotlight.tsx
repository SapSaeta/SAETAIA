import Link from 'next/link'
import { Herramienta, HerramientaEstado } from '@/types'
import Container from '@/components/layout/Container'
import SectionHeader from './SectionHeader'

const ESTADO_STYLES: Record<HerramientaEstado, { label: string; className: string }> = {
  ga: {
    label: 'Disponible',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  beta: {
    label: 'Beta',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  preview: {
    label: 'Preview',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  experimental: {
    label: 'Experimental',
    className: 'bg-violet-50 text-violet-700 border-violet-200',
  },
}

interface ToolSpotlightProps {
  herramientas: Herramienta[]
}

export default function ToolSpotlight({ herramientas }: ToolSpotlightProps) {
  return (
    <section className="border-t border-zinc-200 bg-zinc-50 py-12">
      <Container>
        <SectionHeader title="Herramientas" href="/herramientas" hrefLabel="Ver todas" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {herramientas.map((h) => {
            const estado = ESTADO_STYLES[h.estado]
            return (
              <Link key={h.id} href={`/herramientas/${h.slug}`} className="group block">
                <article className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  {/* Header */}
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${estado.className}`}
                    >
                      {estado.label}
                    </span>
                    <span className="text-[11px] text-zinc-400">{h.categoria}</span>
                  </div>

                  {/* Name */}
                  <h3 className="mb-1.5 text-sm font-semibold text-zinc-900 transition-colors group-hover:text-violet-700">
                    {h.nombre}
                  </h3>

                  {/* Description */}
                  <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">
                    {h.descripcion}
                  </p>

                  {/* Compatible con */}
                  {h.compatible_con.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {h.compatible_con.slice(0, 2).map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-zinc-100 bg-zinc-50 px-1.5 py-0.5 text-[10px] text-zinc-400"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </Link>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
