import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const sql = neon(process.env.DATABASE_URL!)
  try {
    const expired = await sql`
      UPDATE slots SET status='available', "pendingExpiresAt"=null
      WHERE status='pending' AND "pendingExpiresAt" < now()
      RETURNING id
    `
    await sql`
      UPDATE bookings SET status='expired'
      WHERE status='pending_payment' AND "slotId" = ANY(${expired.map((r: any) => r.id)})
    `
    return NextResponse.json({ released: expired.length })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}
