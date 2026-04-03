'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Container from './Container'
import { cn } from '@/lib/utils'

const BRAND_LINKS = [
  {
    href: '/anthropic',
    label: 'Anthropic',
    activeClass: 'text-violet-600',
    hoverClass: 'hover:text-violet-600',
    match: (p: string) => p.startsWith('/anthropic'),
  },
  {
    href: '/sap-ia',
    label: 'SAP IA',
    activeClass: 'text-emerald-600',
    hoverClass: 'hover:text-emerald-600',
    match: (p: string) => p.startsWith('/sap-ia'),
  },
  {
    href: '/openai',
    label: 'OpenAI',
    activeClass: 'text-blue-600',
    hoverClass: 'hover:text-blue-600',
    match: (p: string) => p.startsWith('/openai'),
  },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <Container>
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-lg font-bold tracking-tight text-zinc-900">
              Saeta<span className="text-violet-600">IA</span>
            </span>
          </Link>

          {/* Primary nav: brand sections */}
          <nav className="flex items-center gap-1 text-sm font-medium" aria-label="Secciones principales">
            {BRAND_LINKS.map((link) => {
              const isActive = link.match(pathname)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-md px-3 py-1.5 transition-colors',
                    isActive
                      ? cn(link.activeClass, 'bg-zinc-100 font-semibold')
                      : cn('text-zinc-500', link.hoverClass)
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Secondary nav */}
          <nav className="flex items-center gap-4 text-sm" aria-label="Secciones secundarias">
            <Link
              href="/noticias"
              className={cn(
                'text-zinc-400 transition-colors hover:text-zinc-700',
                pathname.startsWith('/noticias') && 'text-zinc-700 font-medium'
              )}
            >
              Noticias
            </Link>
            <Link
              href="/herramientas"
              className={cn(
                'text-zinc-400 transition-colors hover:text-zinc-700',
                pathname.startsWith('/herramientas') && 'text-zinc-700 font-medium'
              )}
            >
              Herramientas
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  )
}
