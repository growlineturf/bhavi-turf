import { NextResponse } from 'next/server'
import { AUTH_DISABLED, stackServerApp, isAllowedAdmin } from '@/stack'

/** True only when a signed-in Neon Auth user is on the admin allowlist. */
export async function isAdminAuthenticated() {
  if (AUTH_DISABLED) return true
  try {
    const user = await stackServerApp!.getUser()
    return Boolean(user && isAllowedAdmin(user.primaryEmail))
  } catch {
    return false
  }
}

export function unauthorized() {
  return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
}
