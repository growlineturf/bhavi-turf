import { deleteResume, getResumeStatus, uploadResume } from '@portfolio/cms'
import { isAdminAuthenticated, unauthorized } from '@/lib/admin-auth'
import { NextRequest, NextResponse } from 'next/server'

// GET — check if resume exists
export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized()
  const status = await getResumeStatus()
  return NextResponse.json({ success: true, ...status })
}

// POST — upload new resume PDF
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized()
  try {
    const formData = await req.formData()
    const file = formData.get('resume') as File | null
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }
    const status = await uploadResume(file)
    return NextResponse.json({ success: true, message: 'Resume uploaded successfully', ...status })
  } catch (err) {
    console.error('[resume upload]', err)
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Upload failed',
    }, { status: 400 })
  }
}

// DELETE — remove resume
export async function DELETE() {
  if (!(await isAdminAuthenticated())) return unauthorized()
  try {
    const status = await deleteResume()
    return NextResponse.json({ success: true, ...status })
  } catch {
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 })
  }
}
