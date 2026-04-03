import type { Metadata } from 'next'
import { getContenidoByBrand } from '@/lib/contenido'
import BrandPage from '@/components/brand/BrandPage'
import type { BrandConfig } from '@/components/brand/BrandPage'

export const metadata: Metadata = {
  title: 'OpenAI — SaetaIA',
  description:
    'Noticias, investigación y herramientas de OpenAI: GPT, o1, la API, ChatGPT y los últimos avances en IA generativa.',
  alternates: { canonical: 'https://saetaia.com/openai' },
  openGraph: {
    title: 'OpenAI | SaetaIA',
    description:
      'Noticias, investigación y herramientas de OpenAI: GPT, o1, la API, ChatGPT y los últimos avances en IA generativa.',
    url: 'https://saetaia.com/openai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenAI | SaetaIA',
    description:
      'Noticias, investigación y herramientas de OpenAI: GPT, o1, la API, ChatGPT y los últimos avances en IA generativa.',
  },
}

const CONFIG: BrandConfig = {
  brand: 'openai',
  nombre: 'OpenAI',
  descripcion:
    'Cobertura completa de OpenAI: desde los modelos GPT y o1 hasta ChatGPT, la API, DALL·E y los avances en investigación de IA generativa.',
  glowClass: 'bg-blue-200',
  textAccentClass: 'text-blue-600',
  accentBarClass: 'bg-blue-500',
  borderClass: 'border-blue-300',
  pillClass: 'border-blue-200 bg-blue-50 text-blue-700',
}

export default function OpenAIPage() {
  const { noticias, herramientas } = getContenidoByBrand('openai')

  return <BrandPage config={CONFIG} noticias={noticias} herramientas={herramientas} />
}
