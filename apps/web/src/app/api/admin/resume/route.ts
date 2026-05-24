import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'

const RESUME_PATH = join(process.cwd(), 'public', 'resume.pdf')

function requireAuth(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'authenticated'
}

// GET — check if resume exists
export async function GET(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }
  const exists = existsSync(RESUME_PATH)
  return NextResponse.json({ success: true, exists })
}

// POST — upload new resume PDF
export async function POST(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }
  try {
    const formData = await req.formData()
    const file = formData.get('resume') as File | null
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, error: 'Only PDF files are allowed' }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File too large (max 10MB)' }, { status: 400 })
    }
    const buffer = Buffer.from(await file.arrayBuffer())
    writeFileSync(RESUME_PATH, buffer)
    return NextResponse.json({ success: true, message: 'Resume uploaded successfully' })
  } catch (err) {
    console.error('[resume upload]', err)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}

// DELETE — remove resume
export async function DELETE(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }
  try {
    if (existsSync(RESUME_PATH)) {
      const { unlinkSync } = await import('fs')
      unlinkSync(RESUME_PATH)
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 })
  }
}
