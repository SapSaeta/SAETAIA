import { getAllHerramientas } from '@/lib/herramientas'
import Container from '@/components/layout/Container'
import HerramientaGrid from '@/components/herramientas/HerramientaGrid'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Herramientas de IA',
  description:
    'Herramientas prácticas de Anthropic para desarrolladores: Claude Code Skills, MCP, Agent SDK, Computer Use y más.',
  alternates: {
    canonical: 'https://saetaia.com/herramientas',
  },
  openGraph: {
    title: 'Herramientas de IA | SaetaIA',
    description:
      'Herramientas prácticas de Anthropic para desarrolladores: Claude Code Skills, MCP, Agent SDK, Computer Use y más.',
    url: 'https://saetaia.com/herramientas',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Herramientas de IA | SaetaIA',
    description:
      'Herramientas prácticas de Anthropic para desarrolladores: Claude Code Skills, MCP, Agent SDK, Computer Use y más.',
  },
}

export default function HerramientasPage() {
  const herramientas = getAllHerramientas()

  return (
    <Container className="py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Herramientas</h1>
        <p className="text-sm text-zinc-400">
          {herramientas.length} herramientas prácticas para integrar en tus desarrollos con Claude.
        </p>
      </div>
      <HerramientaGrid herramientas={herramientas} />
    </Container>
  )
}
