import type { Categoria } from '@/types'
import { cn } from '@/lib/utils'

// ─── Gradientes y colores por categoría ─────────────────────────────────────

const GRADIENT: Record<Categoria, string> = {
  LLMs:          'from-violet-100 via-violet-50 to-purple-100',
  Herramientas:  'from-blue-100 via-blue-50 to-cyan-100',
  Investigación: 'from-emerald-100 via-emerald-50 to-teal-100',
  API:           'from-amber-100 via-amber-50 to-orange-100',
  Seguridad:     'from-red-100 via-red-50 to-rose-100',
  Empresa:       'from-zinc-100 via-zinc-50 to-slate-100',
}

const ICON_COLOR: Record<Categoria, string> = {
  LLMs:          'text-violet-300',
  Herramientas:  'text-blue-300',
  Investigación: 'text-emerald-300',
  API:           'text-amber-300',
  Seguridad:     'text-red-300',
  Empresa:       'text-zinc-300',
}

// ─── Iconos SVG simples por categoría ────────────────────────────────────────

function CategoryIcon({ categoria }: { categoria: Categoria }) {
  const cls = cn('h-10 w-10 opacity-70', ICON_COLOR[categoria])

  switch (categoria) {
    case 'LLMs':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
      )
    case 'Herramientas':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
      )
    case 'Investigación':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      )
    case 'API':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      )
    case 'Seguridad':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      )
    case 'Empresa':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      )
  }
}

// ─── Patrón decorativo de fondo ──────────────────────────────────────────────

function DotPattern() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-40"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
        backgroundSize: '18px 18px',
      }}
    />
  )
}

// ─── Componente principal ────────────────────────────────────────────────────

interface NoticiaImageProps {
  imagen?: string
  titulo: string
  categoria: Categoria
  className?: string
}

export default function NoticiaImage({ imagen, titulo, categoria, className }: NoticiaImageProps) {
  if (imagen) {
    return (
      <div className={cn('overflow-hidden', className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagen}
          alt={titulo}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          onError={(e) => {
            // Si la imagen falla, ocultar el elemento img y mostrar el fallback
            const target = e.currentTarget
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) parent.dataset.fallback = 'true'
          }}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-gradient-to-br',
        GRADIENT[categoria],
        className
      )}
    >
      <DotPattern />
      <CategoryIcon categoria={categoria} />
    </div>
  )
}
