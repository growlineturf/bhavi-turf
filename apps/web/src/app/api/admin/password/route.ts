import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// Store custom password in a local config file (outside public/)
const CONFIG_PATH = join(process.cwd(), '.admin-config.json')

function requireAuth(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'authenticated'
}

function getPassword(): string {
  try {
    if (existsSync(CONFIG_PATH)) {
      const cfg = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
      if (cfg.password) return cfg.password
    }
  } catch { /* fall through */ }
  return process.env.ADMIN_PASSWORD || 'admin123'
}

function setPassword(newPassword: string) {
  const existing = existsSync(CONFIG_PATH)
    ? JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
    : {}
  writeFileSync(CONFIG_PATH, JSON.stringify({ ...existing, password: newPassword }, null, 2))
}

// Export for use in auth route
export { getPassword }

// PUT — change password (requires current session)
export async function PUT(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }
  try {
    const { currentPassword, newPassword } = await req.json()
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Both current and new password are required' }, { status: 400 })
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: 'New password must be at least 6 characters' }, { status: 400 })
    }
    const stored = getPassword()
    if (currentPassword !== stored) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 401 })
    }
    setPassword(newPassword)
    return NextResponse.json({ success: true, message: 'Password changed successfully' })
  } catch (err) {
    console.error('[password change]', err)
    return NextResponse.json({ success: false, error: 'Failed to change password' }, { status: 500 })
  }
}
