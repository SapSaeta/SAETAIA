import { MetadataRoute } from 'next'
import { getAllNoticias } from '@/lib/noticias'
import { getAllHerramientas } from '@/lib/herramientas'

export default function sitemap(): MetadataRoute.Sitemap {
  const noticias = getAllNoticias()
  const herramientas = getAllHerramientas()

  const noticiaEntries: MetadataRoute.Sitemap = noticias.map((n) => ({
    url: `https://saetaia.com/noticias/${n.slug}`,
    lastModified: new Date(n.fecha),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const herramientaEntries: MetadataRoute.Sitemap = herramientas.map((h) => ({
    url: `https://saetaia.com/herramientas/${h.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: 'https://saetaia.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://saetaia.com/noticias',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://saetaia.com/herramientas',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...noticiaEntries,
    ...herramientaEntries,
  ]
}
