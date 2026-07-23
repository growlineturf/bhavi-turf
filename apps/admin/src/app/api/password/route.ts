import { changeAdminPassword } from '@portfolio/cms'
import { isAdminAuthenticated, unauthorized } from '@/lib/admin-auth'
import { NextRequest, NextResponse } from 'next/server'

// PUT — change password (requires current session)
export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized()
  try {
    const { currentPassword, newPassword } = await req.json()
    await changeAdminPassword(currentPassword, newPassword)
    return NextResponse.json({ success: true, message: 'Password changed successfully' })
  } catch (err) {
    console.error('[password change]', err)
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Failed to change password',
    }, { status: 400 })
  }
}
