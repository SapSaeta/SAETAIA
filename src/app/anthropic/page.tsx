import type { Metadata } from 'next'
import { getContenidoByBrand } from '@/lib/contenido'
import BrandPage from '@/components/brand/BrandPage'
import type { BrandConfig } from '@/components/brand/BrandPage'

export const metadata: Metadata = {
  title: 'Anthropic — SaetaIA',
  description:
    'Noticias, investigación y herramientas de Anthropic: Claude, la API y el ecosistema de IA responsable.',
  alternates: { canonical: 'https://saetaia.com/anthropic' },
  openGraph: {
    title: 'Anthropic | SaetaIA',
    description:
      'Noticias, investigación y herramientas de Anthropic: Claude, la API y el ecosistema de IA responsable.',
    url: 'https://saetaia.com/anthropic',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anthropic | SaetaIA',
    description:
      'Noticias, investigación y herramientas de Anthropic: Claude, la API y el ecosistema de IA responsable.',
  },
}

const CONFIG: BrandConfig = {
  brand: 'anthropic',
  nombre: 'Anthropic',
  descripcion:
    'Seguimiento de las últimas noticias, modelos y herramientas de Anthropic. Desde Claude hasta la API y los avances en IA segura.',
  glowClass: 'bg-violet-200',
  textAccentClass: 'text-violet-600',
  accentBarClass: 'bg-violet-500',
  borderClass: 'border-violet-300',
  pillClass: 'border-violet-200 bg-violet-50 text-violet-700',
}

export default function AnthropicPage() {
  const { noticias, herramientas } = getContenidoByBrand('anthropic')

  return <BrandPage config={CONFIG} noticias={noticias} herramientas={herramientas} />
}
