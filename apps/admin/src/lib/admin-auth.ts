import { NextResponse } from 'next/server'
import { AUTH_DISABLED, getAuth, isAllowedAdmin } from '@/lib/auth/server'

/** True only when a signed-in Neon Auth user is on the admin allowlist. */
export async function isAdminAuthenticated() {
  if (AUTH_DISABLED) return true
  const auth = getAuth()
  if (!auth) return false
  try {
    const { data: session } = await auth.getSession()
    return Boolean(session?.user && isAllowedAdmin(session.user.email))
  } catch {
    return false
  }
}

export function unauthorized() {
  return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
}
