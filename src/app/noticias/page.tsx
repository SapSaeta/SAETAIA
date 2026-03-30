import type { Metadata } from 'next'
import { getAllNoticias } from '@/lib/noticias'
import Container from '@/components/layout/Container'
import NoticiaGrid from '@/components/home/NoticiaGrid'

export const metadata: Metadata = {
  title: 'Noticias de IA',
  description:
    'Últimas noticias sobre inteligencia artificial: modelos de lenguaje, lanzamientos de Anthropic, investigación y herramientas para desarrolladores.',
  alternates: {
    canonical: 'https://saetaia.com/noticias',
  },
  openGraph: {
    title: 'Noticias de IA | SaetaIA',
    description:
      'Últimas noticias sobre inteligencia artificial: modelos de lenguaje, lanzamientos de Anthropic, investigación y herramientas para desarrolladores.',
    url: 'https://saetaia.com/noticias',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noticias de IA | SaetaIA',
    description:
      'Últimas noticias sobre inteligencia artificial: modelos de lenguaje, lanzamientos de Anthropic, investigación y herramientas para desarrolladores.',
  },
}

export default function NoticiasPage() {
  const noticias = getAllNoticias()

  return (
    <Container className="py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Noticias</h1>
        <p className="text-sm text-zinc-400">
          {noticias.length} artículos sobre IA, modelos de lenguaje y herramientas para desarrolladores.
        </p>
      </div>
      <NoticiaGrid noticias={noticias} />
    </Container>
  )
}
