import type { NextRequest } from 'next/server'
import { getAuth } from '@/lib/auth/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ path: string[] }> }

const notConfigured = () =>
  new Response(JSON.stringify({ error: 'AUTH_DISABLED' }), {
    status: 404,
    headers: { 'content-type': 'application/json' },
  })

// Proxies all Neon Auth (Managed Better Auth) requests. Auth is resolved per
// request (never at module load) so the build never needs the auth env.
export async function GET(req: NextRequest, ctx: Ctx) {
  const auth = getAuth()
  if (!auth) return notConfigured()
  return auth.handler().GET(req, ctx)
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const auth = getAuth()
  if (!auth) return notConfigured()
  return auth.handler().POST(req, ctx)
}
