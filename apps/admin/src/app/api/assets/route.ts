import { saveAsset } from '@portfolio/cms'
import { isAdminAuthenticated, unauthorized } from '@/lib/admin-auth'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = 25 * 1024 * 1024 // 25 MB
const ALLOWED = /^(image\/|video\/|application\/pdf$)/

// POST /api/assets — upload a file (image / video / pdf) into Neon.
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized()
  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }
    if (!ALLOWED.test(file.type)) {
      return NextResponse.json({ success: false, error: 'Only images, videos and PDFs are allowed' }, { status: 415 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, error: 'File too large (max 25 MB)' }, { status: 413 })
    }
    const asset = await saveAsset(file)
    return NextResponse.json({ success: true, ...asset })
  } catch (err) {
    console.error('[assets POST]', err)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}
