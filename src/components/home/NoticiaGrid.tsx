'use client'

import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Categoria, Noticia } from '@/types'
import NoticiaCard from './NoticiaCard'
import FeaturedNoticiaCard from './FeaturedNoticiaCard'
import CategoryFilter from './CategoryFilter'
import SearchBar from './SearchBar'

interface NoticiaGridProps {
  noticias: Noticia[]
}

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

export default function NoticiaGrid({ noticias }: NoticiaGridProps) {
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const shouldReduceMotion = useReducedMotion()

  const conteos = useMemo(() =>
    noticias.reduce((acc, n) => {
      acc[n.categoria] = (acc[n.categoria] ?? 0) + 1
      return acc
    }, {} as Record<Categoria, number>),
  [noticias])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const noticiasFiltradas = useMemo(() => {
    let resultado = noticias
    if (categoriaActiva) {
      resultado = resultado.filter((n) => n.categoria === categoriaActiva)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      resultado = resultado.filter(
        (n) =>
          n.titulo.toLowerCase().includes(q) ||
          n.resumen.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    return resultado
  }, [noticias, categoriaActiva, searchQuery])

  const isFiltering = !!categoriaActiva || !!searchQuery.trim()
  const featured = !isFiltering && noticiasFiltradas.length > 0 ? noticiasFiltradas[0] : null
  const gridNoticias = featured ? noticiasFiltradas.slice(1) : noticiasFiltradas

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter
          activeCategoria={categoriaActiva}
          conteos={conteos}
          onCategoriaChange={setCategoriaActiva}
        />
        <div className="w-full sm:w-60">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Empty state */}
      {noticiasFiltradas.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white py-20 text-center"
        >
          <p className="text-zinc-500">No se encontraron noticias</p>
          <p className="mt-1 text-sm text-zinc-400">Prueba con otros términos o categorías</p>
        </motion.div>
      )}

      {/* Featured entry */}
      <AnimatePresence mode="wait">
        {featured && <FeaturedNoticiaCard key={featured.id} noticia={featured} />}
      </AnimatePresence>

      {/* Secondary grid */}
      {gridNoticias.length > 0 && (
        <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {gridNoticias.map((noticia, i) => (
              <motion.div
                key={noticia.id}
                layout
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: shouldReduceMotion ? 0 : i * 0.05, duration: 0.3, ease: EASE }}
              >
                <NoticiaCard noticia={noticia} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Count */}
      {noticiasFiltradas.length > 0 && (
        <p className="pt-1 text-center text-xs text-zinc-400">
          {noticiasFiltradas.length}{' '}
          {noticiasFiltradas.length === 1 ? 'noticia' : 'noticias'}
        </p>
      )}
    </div>
  )
}
