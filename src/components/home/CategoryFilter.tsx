'use client'

import { motion } from 'motion/react'
import { CATEGORIAS, CATEGORIA_COLORS } from '@/data/categorias'
import { Categoria } from '@/types'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  activeCategoria: Categoria | null
  conteos: Record<string, number>
  onCategoriaChange: (categoria: Categoria | null) => void
}

export default function CategoryFilter({
  activeCategoria,
  conteos,
  onCategoriaChange,
}: CategoryFilterProps) {
  const total = Object.values(conteos).reduce((a, b) => a + b, 0)

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoriaChange(null)}
        className={cn(
          'relative rounded-full border px-3 py-1 text-xs font-medium transition-colors',
          activeCategoria === null
            ? 'border-violet-200 bg-violet-50 text-violet-700'
            : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-700'
        )}
      >
        {activeCategoria === null && (
          <motion.span
            layoutId="filter-pill"
            className="absolute inset-0 rounded-full border border-violet-200 bg-violet-50"
            style={{ zIndex: -1 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
          />
        )}
        Todas <span className="text-zinc-400">({total})</span>
      </button>

      {CATEGORIAS.map((cat) => {
        const colors = CATEGORIA_COLORS[cat]
        const count = conteos[cat] || 0
        const isActive = activeCategoria === cat
        if (count === 0) return null

        return (
          <button
            key={cat}
            onClick={() => onCategoriaChange(isActive ? null : cat)}
            className={cn(
              'relative rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              isActive
                ? cn(colors.bg, colors.text, colors.border)
                : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-700'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className={cn('absolute inset-0 rounded-full border', colors.bg, colors.border)}
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
              />
            )}
            {cat} <span className="opacity-60">({count})</span>
          </button>
        )
      })}
    </div>
  )
}
