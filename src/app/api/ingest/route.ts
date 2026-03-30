import { NextRequest, NextResponse } from 'next/server'
import { runIngest } from '@/lib/ingest'

/**
 * POST /api/ingest
 * Header: Authorization: Bearer <INGEST_SECRET>
 * Uso manual: curl -X POST https://saetaia.com/api/ingest -H "Authorization: Bearer <tu-secret>"
 *
 * GET /api/ingest?secret=<CRON_SECRET>
 * Usado por Vercel Cron (vercel.json) — Vercel añade automáticamente el header Authorization.
 */

function isAuthorized(req: NextRequest): boolean {
  // Vercel Cron envia Authorization: Bearer <CRON_SECRET>
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = req.headers.get('authorization')
    if (authHeader === `Bearer ${cronSecret}`) return true
  }

  // Peticiones manuales con INGEST_SECRET
  const ingestSecret = process.env.INGEST_SECRET
  if (ingestSecret) {
    const authHeader = req.headers.get('authorization')?.replace('Bearer ', '')
    const querySecret = new URL(req.url).searchParams.get('secret')
    if (authHeader === ingestSecret || querySecret === ingestSecret) return true
  }

  return false
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const log = await runIngest()
    return NextResponse.json(log, { status: 200 })
  } catch (error) {
    console.error('[ingest] Error crítico:', error)
    return NextResponse.json(
      { error: 'Ingest pipeline failed', detail: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return GET(req)
}

// Aumentar el timeout de la función para fuentes lentas (máx Vercel: 300s en Pro)
export const maxDuration = 60
