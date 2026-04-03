import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getContenidoByBrand } from '@/lib/contenido'
import { getAllNoticias } from '@/lib/noticias'
import Container from '@/components/layout/Container'
import BackButton from '@/components/noticia/BackButton'
import NoticiaHeader from '@/components/noticia/NoticiaHeader'
import NoticiaContent from '@/components/noticia/NoticiaContent'
import ExternalLink from '@/components/ui/ExternalLink'
import type { Noticia } from '@/types'

interface PageProps {
  params: { slug: string }
}

function getNoticia(slug: string): Noticia | undefined {
  // Check brand-specific content first, then fall back to legacy noticias
  const { noticias } = getContenidoByBrand('anthropic')
  const brandMatch = noticias.find((n) => n.slug === slug)
  if (brandMatch) return brandMatch
  return getAllNoticias().find((n) => n.slug === slug)
}

export async function generateStaticParams() {
  const { noticias } = getContenidoByBrand('anthropic')
  // Also include legacy noticias so existing slugs still work
  const legacy = getAllNoticias()
  const all = [...noticias, ...legacy]
  const seen = new Set<string>()
  return all
    .filter((n) => { const ok = !seen.has(n.slug); seen.add(n.slug); return ok })
    .map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const noticia = getNoticia(params.slug)
  if (!noticia) return {}
  const canonicalUrl = `https://saetaia.com/anthropic/${noticia.slug}`
  const ogImage = noticia.imagen
    ? { url: noticia.imagen, width: 1200, height: 630, alt: noticia.titulo }
    : { url: '/opengraph-image', width: 1200, height: 630, alt: noticia.titulo }
  return {
    title: noticia.titulo,
    description: noticia.resumen,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: noticia.titulo,
      description: noticia.resumen,
      type: 'article',
      url: canonicalUrl,
      publishedTime: noticia.fecha,
      tags: noticia.tags,
      images: [ogImage],
    },
    twitter: { card: 'summary_large_image', title: noticia.titulo, description: noticia.resumen },
  }
}

export default function AnthropicSlugPage({ params }: PageProps) {
  const noticia = getNoticia(params.slug)
  if (!noticia) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: noticia.titulo,
    description: noticia.resumen,
    datePublished: noticia.fecha,
    url: `https://saetaia.com/anthropic/${noticia.slug}`,
    publisher: { '@type': 'Organization', name: 'SaetaIA', url: 'https://saetaia.com' },
    ...(noticia.imagen ? { image: noticia.imagen } : {}),
  }

  return (
    <Container className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-2xl space-y-8">
        <BackButton href="/anthropic" label="Volver a Anthropic" />
        <NoticiaHeader noticia={noticia} />
        <NoticiaContent contenido={noticia.contenido} />
        {noticia.url_referencia && (
          <div className="border-t border-zinc-800 pt-6">
            <p className="mb-2 text-xs text-zinc-500">Fuente original</p>
            <ExternalLink href={noticia.url_referencia}>Ver en Anthropic</ExternalLink>
          </div>
        )}
        <div className="border-t border-zinc-800 pt-6">
          <BackButton href="/anthropic" label="Volver a Anthropic" />
        </div>
      </div>
    </Container>
  )
}
