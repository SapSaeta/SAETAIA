import type { Metadata } from 'next'
import { getContenidoByBrand } from '@/lib/contenido'
import BrandPage from '@/components/brand/BrandPage'
import type { BrandConfig } from '@/components/brand/BrandPage'

export const metadata: Metadata = {
  title: 'SAP IA — SaetaIA',
  description:
    'Noticias y herramientas de inteligencia artificial en el ecosistema SAP: Joule, Business AI, integraciones y más.',
  alternates: { canonical: 'https://saetaia.com/sap-ia' },
  openGraph: {
    title: 'SAP IA | SaetaIA',
    description:
      'Noticias y herramientas de inteligencia artificial en el ecosistema SAP: Joule, Business AI, integraciones y más.',
    url: 'https://saetaia.com/sap-ia',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAP IA | SaetaIA',
    description:
      'Noticias y herramientas de inteligencia artificial en el ecosistema SAP: Joule, Business AI, integraciones y más.',
  },
}

const CONFIG: BrandConfig = {
  brand: 'sap',
  nombre: 'SAP IA',
  href: '/sap-ia',
  descripcion:
    'Todo lo que debes saber sobre la inteligencia artificial de SAP: Joule, SAP Business AI, integraciones con modelos de lenguaje y automatización empresarial.',
  glowClass: 'bg-emerald-200',
  textAccentClass: 'text-emerald-600',
  accentBarClass: 'bg-emerald-500',
  borderClass: 'border-emerald-300',
  pillClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

export default function SapIaPage() {
  const { noticias, herramientas } = getContenidoByBrand('sap')

  return <BrandPage config={CONFIG} noticias={noticias} herramientas={herramientas} />
}
