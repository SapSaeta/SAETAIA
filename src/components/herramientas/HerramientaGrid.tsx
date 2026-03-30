'use client'

import { useState } from 'react'
import { Herramienta, HerramientaCategoria } from '@/types'
import HerramientaCard from './HerramientaCard'

const CATEGORIAS: HerramientaCategoria[] = ['Agentes', 'Codificación', 'Datos', 'Integración', 'Interfaz']

interface HerramientaGridProps {
  herramientas: Herramienta[]
}

export default function HerramientaGrid({ herramientas }: HerramientaGridProps) {
  const [categoriaActiva, setCategoriaActiva] = useState<HerramientaCategoria | null>(null)
  const [busqueda, setBusqueda] = useState('')

  const filtradas = herramientas.filter((h) => {
    const matchCategoria = !categoriaActiva || h.categoria === categoriaActiva
    const q = busqueda.toLowerCase().trim()
    const matchBusqueda =
      !q ||
      h.nombre.toLowerCase().includes(q) ||
      h.descripcion.toLowerCase().includes(q) ||
      h.tags.some((t) => t.toLowerCase().includes(q))
    return matchCategoria && matchBusqueda
  })

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar herramientas..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
      />

      {/* Filtros de categoría */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategoriaActiva(null)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            !categoriaActiva
              ? 'border-violet-200 bg-violet-50 text-violet-700'
              : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-700'
          }`}
        >
          Todas
        </button>
        {CATEGORIAS.map((cat) => {
          const count = herramientas.filter((h) => h.categoria === cat).length
          if (count === 0) return null
          return (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat === categoriaActiva ? null : cat)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                categoriaActiva === cat
                  ? 'border-violet-200 bg-violet-50 text-violet-700'
                  : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-700'
              }`}
            >
              {cat} <span className="opacity-60">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {filtradas.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtradas.map((h) => (
            <HerramientaCard key={h.id} herramienta={h} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-zinc-400">
          No se encontraron herramientas para esta búsqueda.
        </p>
      )}
    </div>
  )
}
