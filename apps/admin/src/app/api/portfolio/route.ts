import { getAdminPortfolio, updatePortfolio } from '@portfolio/cms'
import { isAdminAuthenticated, unauthorized } from '@/lib/admin-auth'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/portfolio — return full portfolio data
export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized()
  const data = await getAdminPortfolio()
  return NextResponse.json({ success: true, data })
}

// PUT /api/portfolio — replace provided portfolio sections
export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized()
  try {
    const body = await req.json()
    const updated = await updatePortfolio(body)
    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    console.error('[portfolio PUT]', err)
    return NextResponse.json({ success: false, error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
