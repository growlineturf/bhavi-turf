import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

// DELETE /api/revenue/clear
// Permanently deletes ALL confirmed bookings (normal + 5-over) from the DB.
export async function DELETE(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!)

  const body = await req.json().catch(() => ({}))
  if (body.confirm !== 'PERMANENTLY_DELETE') {
    return NextResponse.json({ error: 'Missing confirmation token' }, { status: 400 })
  }

  try {
    // 1. Get slot IDs of confirmed bookings so we can free them
    const confirmedBookings = await sql`SELECT "slotId" FROM bookings WHERE status = 'confirmed'`
    const slotIds = confirmedBookings.map((r) => r.slotId).filter(Boolean)

    // 2. Delete all confirmed normal bookings
    await sql`DELETE FROM bookings WHERE status = 'confirmed'`

    // 3. Reset those slots back to available
    if (slotIds.length > 0) {
      await sql`UPDATE slots SET status = 'available', "pendingExpiresAt" = NULL WHERE id = ANY(${slotIds})`
    }

    // 4. Delete ALL five_over_bookings (confirmed + cancelled + pending)
    await sql`DELETE FROM five_over_bookings`

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'DELETE_FAILED' }, { status: 500 })
  }
}
