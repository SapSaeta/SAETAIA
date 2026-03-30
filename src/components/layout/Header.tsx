import Link from 'next/link'
import Container from './Container'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-zinc-900">
              Saeta<span className="text-violet-600">IA</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="/" className="transition-colors hover:text-zinc-900">
              Noticias
            </Link>
            <Link href="/herramientas" className="transition-colors hover:text-zinc-900">
              Herramientas
            </Link>
            <a
              href="https://www.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-900"
            >
              Anthropic
            </a>
          </nav>
        </div>
      </Container>
    </header>
  )
}
