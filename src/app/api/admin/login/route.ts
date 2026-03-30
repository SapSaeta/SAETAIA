import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE } from '@/middleware'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { password } = await req.json().catch(() => ({ password: '' }))
  const secret = process.env.ADMIN_SECRET

  if (!secret) {
    return NextResponse.json({ error: 'Admin no configurado' }, { status: 503 })
  }

  if (password !== secret) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  })
  return res
}
