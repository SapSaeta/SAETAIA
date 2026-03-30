import { CATEGORIA_COLORS } from '@/data/categorias'
import { Categoria } from '@/types'
import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  variant?: 'categoria' | 'tag'
  categoria?: Categoria
  className?: string
}

export default function Badge({ label, variant = 'tag', categoria, className }: BadgeProps) {
  if (variant === 'categoria' && categoria) {
    const colors = CATEGORIA_COLORS[categoria]
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border',
          colors.bg,
          colors.text,
          colors.border,
          className
        )}
      >
        {label}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500 border border-zinc-200',
        className
      )}
    >
      {label}
    </span>
  )
}
