import { auth } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

const notConfigured = () =>
  new Response(JSON.stringify({ error: 'AUTH_DISABLED' }), {
    status: 404,
    headers: { 'content-type': 'application/json' },
  })

// Proxies all Neon Auth (Managed Better Auth) requests. When auth is disabled
// for local dev, these endpoints simply 404.
export const { GET, POST } = auth ? auth.handler() : { GET: notConfigured, POST: notConfigured }
