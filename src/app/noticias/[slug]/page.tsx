import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllNoticias, getNoticiaBySlug } from '@/lib/noticias'
import Container from '@/components/layout/Container'
import BackButton from '@/components/noticia/BackButton'
import NoticiaHeader from '@/components/noticia/NoticiaHeader'
import NoticiaContent from '@/components/noticia/NoticiaContent'
import ExternalLink from '@/components/ui/ExternalLink'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllNoticias().map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const noticia = getNoticiaBySlug(params.slug)
  if (!noticia) return {}

  return {
    title: noticia.titulo,
    description: noticia.resumen,
    openGraph: {
      title: noticia.titulo,
      description: noticia.resumen,
      type: 'article',
      publishedTime: noticia.fecha,
      images: noticia.imagen ? [noticia.imagen] : ['/images/og-default.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: noticia.titulo,
      description: noticia.resumen,
    },
  }
}

export default function NoticiaPage({ params }: PageProps) {
  const noticia = getNoticiaBySlug(params.slug)

  if (!noticia) notFound()

  return (
    <Container className="py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <BackButton />
        <NoticiaHeader noticia={noticia} />
        <NoticiaContent contenido={noticia.contenido} />

        {noticia.url_referencia && (
          <div className="border-t border-zinc-800 pt-6">
            <p className="mb-2 text-xs text-zinc-500">Fuente original</p>
            <ExternalLink href={noticia.url_referencia}>
              Ver en Anthropic
            </ExternalLink>
          </div>
        )}

        <div className="border-t border-zinc-800 pt-6">
          <BackButton />
        </div>
      </div>
    </Container>
  )
}
