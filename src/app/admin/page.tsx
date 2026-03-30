import { getDraftEntries } from '@/lib/admin/drafts'
import DraftList from '@/components/admin/DraftList'
import Container from '@/components/layout/Container'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin · Borradores',
  robots: { index: false, follow: false },
}

async function LogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-700"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
        Cerrar sesión
      </button>
    </form>
  )
}

export default async function AdminPage() {
  let drafts: Awaited<ReturnType<typeof getDraftEntries>> = []
  let fetchError: string | null = null

  try {
    drafts = await getDraftEntries()
  } catch (error) {
    fetchError = (error as Error).message
  }

  return (
    <section className="py-10">
      <Container>
        {/* Header del admin */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-violet-600">
                Admin
              </span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900">
              Borradores pendientes
              {drafts.length > 0 && (
                <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                  {drafts.length}
                </span>
              )}
            </h1>
            <p className="mt-0.5 text-sm text-zinc-500">
              Revisa, previsualiza y aprueba las noticias detectadas por el pipeline.
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Instrucción de deploy */}
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <strong>Nota:</strong> Publicar cambia el estado en el archivo JSON.
          Para que aparezca en el sitio, ejecuta <code className="rounded bg-amber-100 px-1 font-mono text-xs">git add content/ &amp;&amp; git commit &amp;&amp; git push</code>.
        </div>

        {/* Error de carga */}
        {fetchError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <strong>Error al cargar borradores:</strong> {fetchError}
          </div>
        )}

        <DraftList drafts={drafts} />
      </Container>
    </section>
  )
}
