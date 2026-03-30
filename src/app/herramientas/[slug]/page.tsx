import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getAllHerramientas, getHerramientaBySlug } from '@/lib/herramientas'
import Container from '@/components/layout/Container'
import BackButton from '@/components/noticia/BackButton'
import HerramientaHeader from '@/components/herramientas/HerramientaHeader'
import NoticiaContent from '@/components/noticia/NoticiaContent'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllHerramientas().map((h) => ({ slug: h.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const herramienta = getHerramientaBySlug(params.slug)
  if (!herramienta) return {}

  const canonicalUrl = `https://saetaia.com/herramientas/${herramienta.slug}`

  return {
    title: herramienta.nombre,
    description: herramienta.descripcion,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: herramienta.nombre,
      description: herramienta.descripcion,
      url: canonicalUrl,
      type: 'website',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: herramienta.nombre }],
    },
    twitter: {
      card: 'summary_large_image',
      title: herramienta.nombre,
      description: herramienta.descripcion,
    },
  }
}

export default function HerramientaPage({ params }: PageProps) {
  const herramienta = getHerramientaBySlug(params.slug)
  if (!herramienta) notFound()

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <BackButton href="/herramientas" label="Volver a herramientas" />
        <HerramientaHeader herramienta={herramienta} />
        <NoticiaContent contenido={herramienta.contenido} />
        <div className="pt-4">
          <BackButton href="/herramientas" label="Volver a herramientas" />
        </div>
      </div>
    </Container>
  )
}
