import { NextResponse } from 'next/server'
import { ADMIN_COOKIE } from '@/middleware'

export async function POST(): Promise<NextResponse> {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(ADMIN_COOKIE)
  return res
}
