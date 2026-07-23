import { SESSION_COOKIE, verifySessionToken } from '@portfolio/cms'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)
}

export function unauthorized() {
  return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
}
