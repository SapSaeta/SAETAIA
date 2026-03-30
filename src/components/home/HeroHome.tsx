'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Noticia } from '@/types'
import { CATEGORIA_COLORS, CATEGORIA_ACCENT } from '@/data/categorias'
import { formatFechaCorta } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface HeroHomeProps {
  noticia: Noticia
  totalNoticias: number
  totalHerramientas: number
}

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

export default function HeroHome({ noticia, totalNoticias, totalHerramientas }: HeroHomeProps) {
  const shouldReduceMotion = useReducedMotion()
  const colors = CATEGORIA_COLORS[noticia.categoria]
  const accent = CATEGORIA_ACCENT[noticia.categoria]

  const fadeUp = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.5, ease: EASE },
        }

  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgb(212 212 216 / 0.55) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />
      {/* Violet glow top-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-100/50 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">

          {/* ── Left: brand + headline ── */}
          <div className="space-y-7">
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" />
                Anthropic · Claude · IA
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.08)}
              className="text-4xl font-black leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl"
            >
              Todo lo que<br />
              pasa en{' '}
              <span className="text-violet-600">IA</span>,<br />
              aquí primero.
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="max-w-sm text-base leading-relaxed text-zinc-500"
            >
              Noticias, lanzamientos y análisis sobre modelos de lenguaje, herramientas y el
              ecosistema Claude.
            </motion.p>

            <motion.div {...fadeUp(0.22)} className="flex items-center gap-5">
              <div>
                <p className="text-xl font-bold tabular-nums text-zinc-900">{totalNoticias}</p>
                <p className="text-xs text-zinc-400">Noticias</p>
              </div>
              <div className="h-7 w-px bg-zinc-200" />
              <div>
                <p className="text-xl font-bold tabular-nums text-zinc-900">{totalHerramientas}</p>
                <p className="text-xs text-zinc-400">Herramientas</p>
              </div>
              <div className="h-7 w-px bg-zinc-200" />
              <div>
                <p className="text-xl font-bold tabular-nums text-zinc-900">6</p>
                <p className="text-xs text-zinc-400">Categorías</p>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.28)}>
              <a
                href="#noticias"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
              >
                Ver últimas noticias
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </motion.div>
          </div>

          {/* ── Right: cover story ── */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, duration: 0.6, ease: EASE }}
          >
            <Link href={`/noticias/${noticia.slug}`} className="group block">
              <article className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-7 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Left accent bar */}
                <div className={cn('absolute bottom-0 left-0 top-0 w-1', accent)} />

                {/* Meta */}
                <div className="mb-5 flex items-center gap-2.5">
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
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                    Cover
                  </span>
                </div>

                {/* Title */}
                <h2 className="mb-3 text-xl font-bold leading-snug text-zinc-900 transition-colors group-hover:text-violet-700 sm:text-2xl">
                  {noticia.titulo}
                </h2>

                {/* Summary */}
                <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-zinc-500">
                  {noticia.resumen}
                </p>

                {/* CTA */}
                <span className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 transition-colors group-hover:text-violet-700">
                  Leer artículo
                  <svg
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </article>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
