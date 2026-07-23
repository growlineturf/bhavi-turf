import { NextResponse } from 'next/server'
import { stackServerApp, isAllowedAdmin } from '@/stack'

/** True only when a signed-in Neon Auth user is on the admin allowlist. */
export async function isAdminAuthenticated() {
  try {
    const user = await stackServerApp.getUser()
    return Boolean(user && isAllowedAdmin(user.primaryEmail))
  } catch {
    return false
  }
}

export function unauthorized() {
  return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
}
