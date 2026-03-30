import { getAllHerramientas } from '@/lib/herramientas'
import Container from '@/components/layout/Container'
import HerramientaGrid from '@/components/herramientas/HerramientaGrid'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Herramientas | SaetaIA',
  description:
    'Herramientas prácticas de Anthropic para desarrolladores: Claude Code Skills, MCP, Agent SDK, Computer Use y más.',
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
