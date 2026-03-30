'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Noticia } from '@/types'
import { CATEGORIA_COLORS, CATEGORIA_ACCENT } from '@/data/categorias'
import { formatFechaCorta } from '@/lib/utils'
import { cn } from '@/lib/utils'
import NoticiaImage from '@/components/ui/NoticiaImage'

interface FeaturedNoticiaCardProps {
  noticia: Noticia
}

export default function FeaturedNoticiaCard({ noticia }: FeaturedNoticiaCardProps) {
  const colors = CATEGORIA_COLORS[noticia.categoria]
  const accent = CATEGORIA_ACCENT[noticia.categoria]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link href={`/noticias/${noticia.slug}`} className="group block">
        <article className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          {/* Accent line top */}
          <div className={cn('absolute left-0 right-0 top-0 z-10 h-0.5', accent)} />

          <div className="flex flex-col sm:flex-row">
            {/* Text side */}
            <div className="flex flex-1 flex-col p-7 sm:p-8">
              {/* Meta row */}
              <div className="mb-4 flex items-center gap-3">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                    colors.bg,
                    colors.text,
                    colors.border
                  )}
                >
                  {noticia.categoria}
                </span>
                <time className="text-xs text-zinc-400" dateTime={noticia.fecha}>
                  {formatFechaCorta(noticia.fecha)}
                </time>
                <span className="ml-auto text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Más reciente
                </span>
              </div>

              {/* Title */}
              <h2 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-zinc-900 transition-colors group-hover:text-violet-700 sm:text-3xl">
                {noticia.titulo}
              </h2>

              {/* Summary */}
              <p className="mb-6 line-clamp-3 text-base leading-relaxed text-zinc-500">
                {noticia.resumen}
              </p>

              {/* Footer row */}
              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {noticia.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-violet-600 transition-colors group-hover:text-violet-700">
                  Leer artículo
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Image side */}
            <NoticiaImage
              imagen={noticia.imagen}
              titulo={noticia.titulo}
              categoria={noticia.categoria}
              className="h-48 w-full shrink-0 sm:h-auto sm:w-64 lg:w-80"
            />
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
