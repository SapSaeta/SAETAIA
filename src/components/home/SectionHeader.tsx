import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  href?: string
  hrefLabel?: string
  className?: string
}

export default function SectionHeader({ title, href, hrefLabel = 'Ver todo', className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-7 flex items-center justify-between', className)}>
      <div className="flex items-center gap-3">
        <div className="h-4 w-0.5 rounded-full bg-violet-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-xs font-medium text-zinc-400 transition-colors hover:text-violet-600"
        >
          {hrefLabel}
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  )
}
