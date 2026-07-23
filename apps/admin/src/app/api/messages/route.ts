import { deleteContactSubmission, getContactSubmissions, markContactRead } from '@portfolio/cms'
import { isAdminAuthenticated, unauthorized } from '@/lib/admin-auth'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized()
  const messages = await getContactSubmissions()
  return NextResponse.json({ success: true, data: messages })
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized()
  try {
    const { id, isRead } = await req.json()
    if (!id) return NextResponse.json({ success: false, error: 'MISSING_ID' }, { status: 400 })
    await markContactRead(id, isRead !== false)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[messages PATCH]', err)
    return NextResponse.json({ success: false, error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized()
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'MISSING_ID' }, { status: 400 })
    await deleteContactSubmission(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[messages DELETE]', err)
    return NextResponse.json({ success: false, error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
