import { MetadataRoute } from 'next'
import { getAllNoticias } from '@/lib/noticias'

export default function sitemap(): MetadataRoute.Sitemap {
  const noticias = getAllNoticias()

  const noticiaEntries: MetadataRoute.Sitemap = noticias.map((n) => ({
    url: `https://saetaia.com/noticias/${n.slug}`,
    lastModified: new Date(n.fecha),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    {
      url: 'https://saetaia.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...noticiaEntries,
  ]
}
