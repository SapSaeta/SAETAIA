import { Categoria } from '@/types'

export const CATEGORIAS: Categoria[] = [
  'LLMs',
  'Herramientas',
  'Investigación',
  'API',
  'Seguridad',
  'Empresa',
]

export const CATEGORIA_COLORS: Record<Categoria, { bg: string; text: string; border: string }> = {
  LLMs: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
  },
  Herramientas: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  Investigación: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  API: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  Seguridad: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  Empresa: {
    bg: 'bg-zinc-100',
    text: 'text-zinc-700',
    border: 'border-zinc-300',
  },
}

export const CATEGORIA_ACCENT: Record<Categoria, string> = {
  LLMs: 'bg-violet-500',
  Herramientas: 'bg-blue-500',
  Investigación: 'bg-emerald-500',
  API: 'bg-amber-500',
  Seguridad: 'bg-red-500',
  Empresa: 'bg-zinc-400',
}
