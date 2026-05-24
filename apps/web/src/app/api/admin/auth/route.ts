import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const CONFIG_PATH = join(process.cwd(), '.admin-config.json')

function getPassword(): string {
  try {
    if (existsSync(CONFIG_PATH)) {
      const cfg = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
      if (cfg.password) return cfg.password
    }
  } catch { /* fall through */ }
  return process.env.ADMIN_PASSWORD || 'admin123'
}

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const adminPassword = getPassword()

  if (password === adminPassword) {
    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_auth', 'authenticated', {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
    })
    return res
  }

  return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 })
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete('admin_auth')
  return res
}
