import { Noticia } from '@/types'
import Container from '@/components/layout/Container'
import SectionHeader from './SectionHeader'
import NoticiaGrid from './NoticiaGrid'

interface NewsFeedProps {
  noticias: Noticia[]
}

export default function NewsFeed({ noticias }: NewsFeedProps) {
  return (
    <section id="noticias" className="bg-white py-12">
      <Container>
        <SectionHeader title="Últimas noticias" />
        <NoticiaGrid noticias={noticias} />
      </Container>
    </section>
  )
}
