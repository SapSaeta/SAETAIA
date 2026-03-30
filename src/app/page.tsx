import type { Metadata } from 'next'
import { getAllNoticias } from '@/lib/noticias'
import { getAllHerramientas } from '@/lib/herramientas'
import HeroHome from '@/components/home/HeroHome'
import HighlightsBar from '@/components/home/HighlightsBar'
import NewsFeed from '@/components/home/NewsFeed'
import ToolSpotlight from '@/components/home/ToolSpotlight'

export const metadata: Metadata = {
  title: 'SaetaIA — Noticias de Inteligencia Artificial',
  description:
    'Las últimas noticias sobre modelos de lenguaje, herramientas y avances en inteligencia artificial. Foco en Anthropic y el ecosistema Claude.',
  alternates: {
    canonical: 'https://saetaia.com',
  },
}

export default function HomePage() {
  const noticias = getAllNoticias()
  const herramientas = getAllHerramientas()

  return (
    <>
      <HeroHome
        noticia={noticias[0]}
        totalNoticias={noticias.length}
        totalHerramientas={herramientas.length}
      />
      <HighlightsBar noticias={noticias.slice(1, 5)} />
      <NewsFeed noticias={noticias} />
      <ToolSpotlight herramientas={herramientas.slice(0, 3)} />
    </>
  )
}
