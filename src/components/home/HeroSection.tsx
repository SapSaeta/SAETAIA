interface HeroSectionProps {
  totalNoticias: number
}

export default function HeroSection({ totalNoticias }: HeroSectionProps) {
  return (
    <div className="border-b border-zinc-200 pb-10 pt-12">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-600">
        Anthropic · IA
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
        Lo último en{' '}
        <span className="text-violet-600">Inteligencia Artificial</span>
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-500">
        Noticias, lanzamientos y análisis sobre modelos de lenguaje, herramientas y el ecosistema
        Claude. {totalNoticias} entradas y actualizando.
      </p>
    </div>
  )
}
