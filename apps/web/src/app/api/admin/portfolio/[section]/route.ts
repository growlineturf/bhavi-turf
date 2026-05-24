import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DATA_PATH = join(process.cwd(), 'public', 'data', 'portfolio.json')

const ALLOWED_SECTIONS = ['profile', 'projects', 'skills', 'experience', 'certifications'] as const
type Section = typeof ALLOWED_SECTIONS[number]

function requireAuth(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'authenticated'
}

function readData() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
}

function writeData(data: unknown) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

// GET /api/admin/portfolio/[section]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  if (!requireAuth(req)) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }
  const { section } = await params
  if (!ALLOWED_SECTIONS.includes(section as Section)) {
    return NextResponse.json({ success: false, error: 'NOT_FOUND' }, { status: 404 })
  }
  const data = readData()
  return NextResponse.json({ success: true, data: data[section] })
}

// PUT /api/admin/portfolio/[section]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  if (!requireAuth(req)) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }
  const { section } = await params
  if (!ALLOWED_SECTIONS.includes(section as Section)) {
    return NextResponse.json({ success: false, error: 'NOT_FOUND' }, { status: 404 })
  }
  try {
    const body = await req.json()
    const data = readData()
    data[section] = body
    writeData(data)
    return NextResponse.json({ success: true, data: data[section] })
  } catch (err) {
    console.error(`[admin/portfolio/${section} PUT]`, err)
    return NextResponse.json({ success: false, error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
