import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const ADMIN_COOKIE = 'saetaia-admin'

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // Rutas públicas del admin: login
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const secret = process.env.ADMIN_SECRET
  if (!secret) {
    // Admin desactivado si no hay secreto configurado
    return new NextResponse('Panel de administración no configurado. Define ADMIN_SECRET en .env.local.', {
      status: 503,
    })
  }

  const session = request.cookies.get(ADMIN_COOKIE)?.value
  if (session !== secret) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
