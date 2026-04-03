'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Container from './Container'
import { cn } from '@/lib/utils'

const BRAND_LINKS = [
  {
    href: '/anthropic',
    label: 'Anthropic',
    activeClass: 'text-violet-600',
    hoverClass: 'hover:text-violet-600',
    activeBg: 'bg-violet-50',
    match: (p: string) => p.startsWith('/anthropic'),
  },
  {
    href: '/sap-ia',
    label: 'SAP IA',
    activeClass: 'text-emerald-600',
    hoverClass: 'hover:text-emerald-600',
    activeBg: 'bg-emerald-50',
    match: (p: string) => p.startsWith('/sap-ia'),
  },
  {
    href: '/openai',
    label: 'OpenAI',
    activeClass: 'text-blue-600',
    hoverClass: 'hover:text-blue-600',
    activeBg: 'bg-blue-50',
    match: (p: string) => p.startsWith('/openai'),
  },
]

const SECONDARY_LINKS = [
  { href: '/noticias', label: 'Noticias', match: (p: string) => p.startsWith('/noticias') },
  { href: '/herramientas', label: 'Herramientas', match: (p: string) => p.startsWith('/herramientas') },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
      <Container>
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <span className="text-lg font-bold tracking-tight text-zinc-900">
              Saeta<span className="text-violet-600">IA</span>
            </span>
          </Link>

          {/* Desktop nav: brand sections */}
          <nav
            className="hidden sm:flex items-center gap-1 text-sm font-medium"
            aria-label="Secciones principales"
          >
            {BRAND_LINKS.map((link) => {
              const isActive = link.match(pathname)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-md px-3 py-1.5 transition-colors',
                    isActive
                      ? cn(link.activeClass, link.activeBg, 'font-semibold')
                      : cn('text-zinc-500', link.hoverClass)
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop secondary nav */}
          <nav
            className="hidden sm:flex items-center gap-4 text-sm"
            aria-label="Secciones secundarias"
          >
            {SECONDARY_LINKS.map((link) => {
              const isActive = link.match(pathname)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-zinc-400 transition-colors hover:text-zinc-700',
                    isActive && 'text-zinc-700 font-medium'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="sm:hidden rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </Container>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-zinc-200 bg-white/95 backdrop-blur-md">
          <Container>
            <nav className="py-3 space-y-0.5" aria-label="Menú móvil">
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Plataformas
              </p>
              {BRAND_LINKS.map((link) => {
                const isActive = link.match(pathname)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? cn(link.activeClass, link.activeBg, 'font-semibold')
                        : cn('text-zinc-600', link.hoverClass)
                    )}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <div className="my-2 border-t border-zinc-100" />
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Explorar
              </p>
              {SECONDARY_LINKS.map((link) => {
                const isActive = link.match(pathname)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'text-zinc-900 font-medium bg-zinc-100'
                        : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}
