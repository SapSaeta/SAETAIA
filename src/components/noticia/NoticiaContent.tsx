import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface NoticiaContentProps {
  contenido: string
}

export default function NoticiaContent({ contenido }: NoticiaContentProps) {
  return (
    <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-headings:text-zinc-900 prose-p:text-zinc-600 prose-strong:text-zinc-900 prose-code:rounded prose-code:bg-violet-50 prose-code:px-1 prose-code:py-0.5 prose-code:text-violet-700 prose-pre:border prose-pre:border-zinc-200 prose-pre:bg-zinc-900 prose-a:text-violet-600 prose-a:no-underline hover:prose-a:text-violet-700 hover:prose-a:underline prose-blockquote:border-violet-400 prose-blockquote:text-zinc-500 prose-th:text-zinc-700 prose-td:text-zinc-600 prose-li:text-zinc-600">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{contenido}</ReactMarkdown>
    </div>
  )
}
