import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

function db() { return neon(process.env.DATABASE_URL!) }

// GET bookings (admin)
export async function GET(req: NextRequest) {
  const sql = db()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const phone  = searchParams.get('phone')
  try {
    // Recovery lookup: check if booking already exists for this phone (last 5 min)
    if (phone) {
      const rows = await sql`
        SELECT b.status, b."createdAt"
        FROM bookings b
        WHERE b."customerPhone" = ${phone}
          AND b."createdAt" > now() - interval '5 minutes'
        ORDER BY b."createdAt" DESC LIMIT 1
      `
      return NextResponse.json(rows[0] ?? null)
    }

    const rows = status
      ? await sql`
          SELECT b.*, row_to_json(s) as slot
          FROM bookings b JOIN slots s ON s.id = b."slotId"
          WHERE b.status = ${status}
          ORDER BY b."createdAt" DESC LIMIT 200
        `
      : await sql`
          SELECT b.*, row_to_json(s) as slot
          FROM bookings b JOIN slots s ON s.id = b."slotId"
          ORDER BY b."createdAt" DESC LIMIT 200
        `
    return NextResponse.json(rows)
  } catch (e) {
    console.error(e)
    return NextResponse.json([], { status: 500 })
  }
}

// POST — create booking(s) for a selected range (atomic: 2 DB calls total)
export async function POST(req: NextRequest) {
  const sql = db()
  const body = await req.json()
  const { slotId, slotIds, customerName, customerPhone, totalAmount, advanceAmount, gpayNumber } = body

  const ids: string[] = slotIds ?? (slotId ? [slotId] : [])
  if (!ids.length) return NextResponse.json({ error: 'slotIds required' }, { status: 400 })

  try {
    // 1. Get settings + verify slots available — one query
    const [settings, slots] = await Promise.all([
      sql`SELECT "advanceAmount","gpayNumber" FROM settings WHERE id='singleton' LIMIT 1`,
      sql`SELECT id, status FROM slots WHERE id = ANY(${ids})`,
    ])

    const adv  = advanceAmount ?? settings[0]?.advanceAmount ?? 500
    const gpay = gpayNumber   ?? settings[0]?.gpayNumber   ?? ''

    const invalid = slots.filter((s: any) =>
      s.status !== 'available' && s.status !== 'pending'
    )
    if (invalid.length > 0) {
      return NextResponse.json({ error: 'SLOT_UNAVAILABLE' }, { status: 409 })
    }

    const groupId = crypto.randomUUID()

    // 2. Batch INSERT all bookings in ONE query + UPDATE slots in ONE query (parallel)
    const bookingValues = ids.map(sid => ({
      sid, groupId,
      customerName: customerName ?? '',
      customerPhone: customerPhone ?? '',
      totalAmount: totalAmount ?? 0,
      adv, gpay,
    }))

    await Promise.all([
      // Batch insert via json_array_elements
      sql`
        INSERT INTO bookings (id, "bookingCode", "slotId", "customerName", "customerPhone",
          "totalAmount", "advanceAmount", "gpayNumber", status, "createdAt")
        SELECT
          gen_random_uuid(),
          (v->>'groupId')::text,
          (v->>'sid')::uuid,
          (v->>'customerName')::text,
          (v->>'customerPhone')::text,
          (v->>'totalAmount')::numeric,
          (v->>'adv')::numeric,
          (v->>'gpay')::text,
          'pending_payment',
          now()
        FROM json_array_elements(${JSON.stringify(bookingValues)}::json) AS v
      `,
      // Mark all slots booked
      sql`
        UPDATE slots SET status='booked', "pendingExpiresAt"=null
        WHERE id = ANY(${ids})
      `,
    ])

    return NextResponse.json({ success: true, slotCount: ids.length })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}

// PATCH — admin confirm/cancel
export async function PATCH(req: NextRequest) {
  const sql = db()
  const { id, status } = await req.json()
  try {
    const bookings = await sql`
      UPDATE bookings SET
        status = ${status},
        "confirmedAt" = ${status === 'confirmed' ? new Date().toISOString() : null},
        "confirmedByAdmin" = ${status === 'confirmed'}
      WHERE id = ${id} RETURNING *
    `
    const b = bookings[0]
    if (status === 'confirmed') {
      await sql`UPDATE slots SET status='booked' WHERE id=${b.slotId}`
    } else if (status === 'cancelled') {
      await sql`UPDATE bookings SET status='cancelled' WHERE "bookingCode"=${b.bookingCode}`
      await sql`
        UPDATE slots SET status='available', "pendingExpiresAt"=null
        WHERE id IN (
          SELECT "slotId" FROM bookings WHERE "bookingCode"=${b.bookingCode}
        )
      `
    }
    return NextResponse.json(b)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}
