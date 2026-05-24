import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DATA_PATH = join(process.cwd(), 'public', 'data', 'portfolio.json')

function requireAuth(req: NextRequest) {
  const cookie = req.cookies.get('admin_auth')?.value
  return cookie === 'authenticated'
}

function readData() {
  try {
    return JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
  } catch {
    return null
  }
}

function writeData(data: unknown) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

// GET /api/admin/portfolio — return full portfolio data
export async function GET(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }
  const data = readData()
  if (!data) return NextResponse.json({ success: false, error: 'NOT_FOUND' }, { status: 404 })
  return NextResponse.json({ success: true, data })
}

// PUT /api/admin/portfolio — replace full portfolio data
export async function PUT(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const current = readData()
    const updated = { ...current, ...body }
    writeData(updated)
    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    console.error('[admin/portfolio PUT]', err)
    return NextResponse.json({ success: false, error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
