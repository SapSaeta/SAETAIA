import Link from 'next/link'

interface BackButtonProps {
  href?: string
  label?: string
}

export default function BackButton({ href = '/', label = 'Volver a noticias' }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-700"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </Link>
  )
}
