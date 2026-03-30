import { getAllNoticias } from '@/lib/noticias'
import { getAllHerramientas } from '@/lib/herramientas'
import HeroHome from '@/components/home/HeroHome'
import HighlightsBar from '@/components/home/HighlightsBar'
import NewsFeed from '@/components/home/NewsFeed'
import ToolSpotlight from '@/components/home/ToolSpotlight'

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
