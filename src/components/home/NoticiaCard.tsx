'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Noticia } from '@/types'
import { CATEGORIA_COLORS } from '@/data/categorias'
import { formatFechaCorta } from '@/lib/utils'
import { cn } from '@/lib/utils'
import NoticiaImage from '@/components/ui/NoticiaImage'

interface NoticiaCardProps {
  noticia: Noticia
}

export default function NoticiaCard({ noticia }: NoticiaCardProps) {
  const colors = CATEGORIA_COLORS[noticia.categoria]

  return (
    <Link href={`/noticias/${noticia.slug}`} className="group block h-full">
      <motion.article
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
      >
        {/* Cover image */}
        <NoticiaImage
          imagen={noticia.imagen}
          titulo={noticia.titulo}
          categoria={noticia.categoria}
          className="h-36 w-full shrink-0"
        />

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Meta */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
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
          </div>

          {/* Title */}
          <h2 className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-violet-700">
            {noticia.titulo}
          </h2>

          {/* Summary */}
          <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500">
            {noticia.resumen}
          </p>
        </div>
      </motion.article>
    </Link>
  )
}
