import type { Noticia } from '@/types'
import type { Brand } from '@/types/ingest'
import type { HerramientaItem } from '@/lib/contenido'
import Container from '@/components/layout/Container'
import NoticiaCard from '@/components/home/NoticiaCard'
import HerramientaItemCard from './HerramientaItemCard'

export interface BrandConfig {
  brand: Brand
  nombre: string
  descripcion: string
  /** URL path for this brand section, e.g. "/anthropic" */
  href: string
  /** Tailwind bg class for glow/accent */
  glowClass: string
  /** Tailwind text class for headings */
  textAccentClass: string
  /** Tailwind bg class for accent bar on cards */
  accentBarClass: string
  /** Tailwind border class for section divider */
  borderClass: string
  /** Badge pill classes */
  pillClass: string
}

interface BrandPageProps {
  config: BrandConfig
  noticias: Noticia[]
  herramientas: HerramientaItem[]
}

export default function BrandPage({ config, noticias, herramientas }: BrandPageProps) {
  return (
    <>
      {/* ── Brand Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
        {/* Subtle dot grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(212 212 216 / 0.4) 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />
        {/* Glow blob */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl opacity-30 ${config.glowClass}`}
        />
        <Container className="relative py-12 sm:py-16">
          <div className="max-w-2xl space-y-4">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${config.pillClass}`}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
              {config.nombre}
            </span>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-zinc-900 sm:text-4xl">
              {config.nombre}{' '}
              <span className={config.textAccentClass}>en SaetaIA</span>
            </h1>
            <p className="text-base leading-relaxed text-zinc-500">{config.descripcion}</p>
            {/* Stats */}
            <div className="flex items-center gap-5 pt-1">
              <div>
                <p className="text-xl font-bold tabular-nums text-zinc-900">{noticias.length}</p>
                <p className="text-xs text-zinc-400">Noticias</p>
              </div>
              <div className="h-7 w-px bg-zinc-200" />
              <div>
                <p className="text-xl font-bold tabular-nums text-zinc-900">{herramientas.length}</p>
                <p className="text-xs text-zinc-400">Herramientas</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Noticias ───────────────────────────────────────────────────── */}
      <section id="noticias" className="bg-white">
        <Container className="py-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">
                Últimas{' '}
                <span className={config.textAccentClass}>Noticias</span>
              </h2>
              <p className="text-sm text-zinc-400">
                {noticias.length > 0
                  ? `${noticias.length} ${noticias.length === 1 ? 'artículo' : 'artículos'} sobre ${config.nombre}`
                  : `Aún no hay noticias sobre ${config.nombre}`}
              </p>
            </div>
          </div>

          {noticias.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 py-16 text-center">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${config.glowClass} opacity-60`}>
                <svg
                  className="h-6 w-6 text-zinc-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                  />
                </svg>
              </div>
              <p className="font-medium text-zinc-600">Sin noticias todavía</p>
              <p className="mt-1 text-sm text-zinc-400">
                Vuelve pronto para ver las últimas novedades de {config.nombre}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {noticias.map((noticia) => (
                <NoticiaCard key={noticia.id} noticia={noticia} basePath={config.href} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ── Visual Divider ─────────────────────────────────────────────── */}
      <div className="border-y border-zinc-200 bg-zinc-50 py-4">
        <Container>
          <div className="flex items-center gap-3">
            <div className={`h-0.5 w-8 rounded-full ${config.accentBarClass}`} />
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Herramientas
            </span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>
        </Container>
      </div>

      {/* ── Herramientas ──────────────────────────────────────────────── */}
      <section id="herramientas" className="bg-zinc-50">
        <Container className="py-10">
          <div className="mb-6 space-y-1">
            <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">
              Herramientas{' '}
              <span className={config.textAccentClass}>Disponibles</span>
            </h2>
            <p className="text-sm text-zinc-400">
              {herramientas.length > 0
                ? `${herramientas.length} ${herramientas.length === 1 ? 'herramienta' : 'herramientas'} de ${config.nombre}`
                : `Herramientas de ${config.nombre} próximamente`}
            </p>
          </div>

          {herramientas.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-16 text-center">
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${config.glowClass} opacity-60`}
              >
                <svg
                  className="h-6 w-6 text-zinc-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                  />
                </svg>
              </div>
              <p className="font-medium text-zinc-600">Próximamente</p>
              <p className="mt-1 text-sm text-zinc-400">
                Estamos preparando las herramientas de {config.nombre}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {herramientas.map((herramienta) => (
                <HerramientaItemCard
                  key={herramienta.id}
                  herramienta={herramienta}
                  accentClass={config.accentBarClass}
                />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
