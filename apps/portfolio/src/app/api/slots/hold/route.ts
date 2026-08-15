import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!)
  const body = await req.json()

  // Accept both single slotId (legacy) and slotIds array
  const slotIds: string[] = body.slotIds ?? (body.slotId ? [body.slotId] : [])
  if (!slotIds.length) {
    return NextResponse.json({ error: 'slotIds required' }, { status: 400 })
  }

  const pendingExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

  try {
    // Check all slots are currently available
    const current = await sql`
      SELECT id, status FROM slots WHERE id = ANY(${slotIds})
    `
    const unavailable = current.filter((r: any) => r.status !== 'available')
    if (unavailable.length > 0) {
      return NextResponse.json({ error: 'SLOT_UNAVAILABLE' }, { status: 409 })
    }
    if (current.length !== slotIds.length) {
      return NextResponse.json({ error: 'SLOT_NOT_FOUND' }, { status: 404 })
    }

    // Atomically hold all slots
    const updated = await sql`
      UPDATE slots
      SET status = 'pending', "pendingExpiresAt" = ${pendingExpiresAt}
      WHERE id = ANY(${slotIds}) AND status = 'available'
      RETURNING id
    `

    // If some slots were grabbed between check and update, rollback
    if (updated.length !== slotIds.length) {
      await sql`
        UPDATE slots SET status = 'available', "pendingExpiresAt" = null
        WHERE id = ANY(${slotIds})
      `
      return NextResponse.json({ error: 'SLOT_UNAVAILABLE' }, { status: 409 })
    }

    return NextResponse.json({ held: updated.length, pendingExpiresAt })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}
