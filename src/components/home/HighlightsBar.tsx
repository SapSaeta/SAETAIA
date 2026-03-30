'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Noticia } from '@/types'
import { CATEGORIA_ACCENT, CATEGORIA_COLORS } from '@/data/categorias'
import { formatFechaCorta } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface HighlightsBarProps {
  noticias: Noticia[]
}

export default function HighlightsBar({ noticias }: HighlightsBarProps) {
  const shouldReduceMotion = useReducedMotion()

  if (noticias.length === 0) return null

  return (
    <section className="border-b border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-5xl px-0 sm:px-6 lg:px-8">
        <div className="flex items-stretch overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* Label */}
          <div className="flex shrink-0 items-center border-r border-zinc-200 px-4 sm:px-5">
            <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Reciente
            </span>
          </div>

          {/* Items */}
          {noticias.map((noticia, i) => {
            const dot = CATEGORIA_ACCENT[noticia.categoria]
            const colors = CATEGORIA_COLORS[noticia.categoria]

            return (
              <motion.div
                key={noticia.id}
                initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                className={cn(
                  'shrink-0 border-r border-zinc-200 last:border-r-0',
                  i >= 3 && 'hidden xl:block'
                )}
              >
                <Link
                  href={`/noticias/${noticia.slug}`}
                  className="group flex h-full items-center gap-3 px-5 py-3.5 transition-colors hover:bg-zinc-100"
                >
                  <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dot)} />
                  <span className={cn('shrink-0 text-[11px] font-semibold', colors.text)}>
                    {noticia.categoria}
                  </span>
                  <span className="max-w-[200px] truncate text-xs font-medium text-zinc-700 transition-colors group-hover:text-violet-700">
                    {noticia.titulo}
                  </span>
                  <time className="shrink-0 text-[11px] text-zinc-400">
                    {formatFechaCorta(noticia.fecha)}
                  </time>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
