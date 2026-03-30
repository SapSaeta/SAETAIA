import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE } from '@/middleware'
import { rejectEntry } from '@/lib/ingest'

function isAuthenticated(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET
  return !!secret && req.cookies.get(ADMIN_COOKIE)?.value === secret
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { slug } = await req.json().catch(() => ({ slug: '' }))
  if (!slug) {
    return NextResponse.json({ error: 'slug requerido' }, { status: 400 })
  }

  try {
    const ok = await rejectEntry(slug)
    if (!ok) return NextResponse.json({ error: 'Borrador no encontrado' }, { status: 404 })
    return NextResponse.json({ ok: true, slug })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
