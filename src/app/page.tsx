import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllNoticias } from '@/lib/noticias'
import { getAllHerramientas } from '@/lib/herramientas'
import { getAllContenido } from '@/lib/contenido'
import HeroHome from '@/components/home/HeroHome'
import HighlightsBar from '@/components/home/HighlightsBar'
import NewsFeed from '@/components/home/NewsFeed'
import ToolSpotlight from '@/components/home/ToolSpotlight'
import Container from '@/components/layout/Container'
import NoticiaCard from '@/components/home/NoticiaCard'

export const metadata: Metadata = {
  title: 'SaetaIA — Noticias de Inteligencia Artificial',
  description:
    'Las últimas noticias sobre modelos de lenguaje, herramientas y avances en inteligencia artificial. Anthropic, OpenAI, SAP y más.',
  alternates: {
    canonical: 'https://saetaia.com',
  },
}

const BRAND_META = [
  {
    brand: 'anthropic' as const,
    label: 'Anthropic',
    href: '/anthropic',
    description: 'Claude, la API y la investigación de IA responsable.',
    accentClass: 'text-violet-600',
    borderClass: 'border-violet-200',
    bgClass: 'bg-violet-50',
    pillClass: 'bg-violet-100 text-violet-700',
    hoverClass: 'hover:border-violet-400',
  },
  {
    brand: 'sap' as const,
    label: 'SAP IA',
    href: '/sap-ia',
    description: 'Joule, Business AI y automatización empresarial con IA.',
    accentClass: 'text-emerald-600',
    borderClass: 'border-emerald-200',
    bgClass: 'bg-emerald-50',
    pillClass: 'bg-emerald-100 text-emerald-700',
    hoverClass: 'hover:border-emerald-400',
  },
  {
    brand: 'openai' as const,
    label: 'OpenAI',
    href: '/openai',
    description: 'GPT, o1, ChatGPT y los últimos avances en IA generativa.',
    accentClass: 'text-blue-600',
    borderClass: 'border-blue-200',
    bgClass: 'bg-blue-50',
    pillClass: 'bg-blue-100 text-blue-700',
    hoverClass: 'hover:border-blue-400',
  },
]

export default function HomePage() {
  const noticias = getAllNoticias()
  const herramientas = getAllHerramientas()
  const allContenido = getAllContenido()

  return (
    <>
      <HeroHome
        noticia={noticias[0]}
        totalNoticias={noticias.length}
        totalHerramientas={herramientas.length}
      />
      <HighlightsBar noticias={noticias.slice(1, 5)} />

      {/* ── Brand Previews ──────────────────────────────────────────── */}
      <section className="bg-zinc-50 py-12 border-b border-zinc-200">
        <Container>
          <div className="mb-8 space-y-1">
            <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">Por plataforma</h2>
            <p className="text-sm text-zinc-400">
              Explora las últimas novedades de cada empresa de IA
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {BRAND_META.map((meta) => {
              const brandData = allContenido.find((c) => c.brand === meta.brand)
              const brandNoticias = brandData?.noticias ?? []
              const latest = brandNoticias.slice(0, 2)

              return (
                <div
                  key={meta.brand}
                  className={`rounded-2xl border ${meta.borderClass} ${meta.bgClass} ${meta.hoverClass} transition-colors duration-200 overflow-hidden`}
                >
                  {/* Card header */}
                  <div className="border-b border-zinc-200/60 px-5 py-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${meta.accentClass}`}>{meta.label}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${meta.pillClass}`}>
                        {brandNoticias.length} noticias
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">{meta.description}</p>
                  </div>

                  {/* Latest news previews */}
                  <div className="divide-y divide-zinc-200/60">
                    {latest.length === 0 ? (
                      <div className="px-5 py-6 text-center">
                        <p className="text-xs text-zinc-400">Próximamente</p>
                      </div>
                    ) : (
                      latest.map((noticia) => (
                        <Link
                          key={noticia.id}
                          href={`${meta.href}/${noticia.slug}`}
                          className="group block px-5 py-3.5 transition-colors hover:bg-white/60"
                        >
                          <p className={`line-clamp-1 text-xs font-medium text-zinc-700 transition-colors group-hover:${meta.accentClass}`}>
                            {noticia.titulo}
                          </p>
                          <p className="mt-0.5 text-[11px] text-zinc-400">{noticia.fecha}</p>
                        </Link>
                      ))
                    )}
                  </div>

                  {/* Footer CTA */}
                  <div className="px-5 py-3 border-t border-zinc-200/60">
                    <Link
                      href={meta.href}
                      className={`text-xs font-semibold ${meta.accentClass} transition-opacity hover:opacity-80`}
                    >
                      Ver todo de {meta.label} →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      <NewsFeed noticias={noticias} />
      <ToolSpotlight herramientas={herramientas.slice(0, 3)} />
    </>
  )
}
