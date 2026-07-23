import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'portfolio_admin_session'
const PUBLIC_PATHS = ['/login', '/api/auth/login']

function base64UrlEncode(bytes: ArrayBuffer) {
  const value = String.fromCharCode(...new Uint8Array(bytes))
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  return atob(padded)
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(
      process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'portfolio-dev-secret'
    ),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  return base64UrlEncode(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)))
}

async function verifySession(token?: string) {
  if (!token) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false
  if ((await sign(payload)) !== signature) return false

  try {
    const data = JSON.parse(base64UrlDecode(payload)) as { exp?: number }
    return typeof data.exp === 'number' && data.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
  const isAuthenticated = await verifySession(request.cookies.get(COOKIE_NAME)?.value)

  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!isPublic && !isAuthenticated) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
