import { Noticia } from '@/types'
import Badge from '@/components/ui/Badge'
import NoticiaImage from '@/components/ui/NoticiaImage'
import { formatFecha } from '@/lib/utils'

interface NoticiaHeaderProps {
  noticia: Noticia
}

export default function NoticiaHeader({ noticia }: NoticiaHeaderProps) {
  return (
    <div className="space-y-5 border-b border-zinc-200 pb-8">
      <div className="flex items-center gap-3">
        <Badge label={noticia.categoria} variant="categoria" categoria={noticia.categoria} />
        <time className="text-sm text-zinc-400" dateTime={noticia.fecha}>
          {formatFecha(noticia.fecha)}
        </time>
      </div>

      <h1 className="text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-3xl">
        {noticia.titulo}
      </h1>

      <p className="text-base leading-relaxed text-zinc-500">{noticia.resumen}</p>

      {/* Cover image */}
      <NoticiaImage
        imagen={noticia.imagen}
        titulo={noticia.titulo}
        categoria={noticia.categoria}
        className="h-52 w-full overflow-hidden rounded-xl sm:h-64"
      />

      {noticia.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {noticia.tags.map((tag) => (
            <Badge key={tag} label={tag} />
          ))}
        </div>
      )}
    </div>
  )
}
