import { loginAdmin, SESSION_COOKIE, SESSION_MAX_AGE } from '@portfolio/cms'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const token = await loginAdmin(String(password || ''))

  if (!token) {
    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
