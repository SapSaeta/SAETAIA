import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'SaetaIA — Noticias de Inteligencia Artificial',
    template: '%s | SaetaIA',
  },
  description:
    'Las últimas noticias sobre modelos de lenguaje, herramientas y avances en inteligencia artificial. Foco en Anthropic y el ecosistema Claude.',
  metadataBase: new URL('https://saetaia.com'),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://saetaia.com',
    siteName: 'SaetaIA',
    title: 'SaetaIA — Noticias de Inteligencia Artificial',
    description:
      'Las últimas noticias sobre modelos de lenguaje, herramientas y avances en inteligencia artificial.',
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'SaetaIA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaetaIA — Noticias de Inteligencia Artificial',
    description:
      'Las últimas noticias sobre modelos de lenguaje, herramientas y avances en inteligencia artificial.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-zinc-50 font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
