import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

function db() { return neon(process.env.DATABASE_URL!) }

/** Ensure groupId column exists on bookings (idempotent, runs once per cold start effectively) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureGroupId(sql: any) {
  try {
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS "groupId" UUID`
  } catch { /* already exists or unsupported — safe to ignore */ }
}

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

// POST — atomically claim slots then insert bookings
export async function POST(req: NextRequest) {
  const sql = db()
  const body = await req.json()
  const { slotId, slotIds, customerName, customerPhone, totalAmount, advanceAmount, gpayNumber } = body

  const ids: string[] = slotIds ?? (slotId ? [slotId] : [])
  if (!ids.length) return NextResponse.json({ error: 'slotIds required' }, { status: 400 })

  try {
    await ensureGroupId(sql)

    // 1. Fetch settings
    const settings = await sql`SELECT "advanceAmount","gpayNumber" FROM settings WHERE id='singleton' LIMIT 1`
    const adv  = advanceAmount ?? settings[0]?.advanceAmount ?? 500
    const gpay = gpayNumber   ?? settings[0]?.gpayNumber   ?? ''

    // 2. Atomically claim slots — UPDATE is the gate, not a preceding SELECT
    //    Only slots currently 'available' or 'pending' can be claimed.
    const claimed = await sql`
      UPDATE slots
      SET status = 'booked', "pendingExpiresAt" = null
      WHERE id = ANY(${ids}) AND status IN ('available', 'pending')
      RETURNING id
    `

    const claimedIds = claimed.map((r: any) => String(r.id))

    // 3. If we couldn't claim all requested slots, roll back ONLY what we just locked
    if (claimedIds.length !== ids.length) {
      if (claimedIds.length > 0) {
        await sql`
          UPDATE slots SET status = 'available', "pendingExpiresAt" = null
          WHERE id = ANY(${claimedIds})
        `
      }
      return NextResponse.json({ error: 'SLOT_UNAVAILABLE' }, { status: 409 })
    }

    // 4. All slots claimed — insert booking rows (one per slot, shared groupId)
    const groupId  = crypto.randomUUID()
    const bookingValues = claimedIds.map(sid => ({
      sid,
      groupId,
      bookingCode: crypto.randomUUID(), // unique per slot
      customerName: customerName ?? '',
      customerPhone: customerPhone ?? '',
      totalAmount: totalAmount ?? 0,
      adv, gpay,
    }))

    await sql`
      INSERT INTO bookings (id, "bookingCode", "groupId", "slotId", "customerName", "customerPhone",
        "totalAmount", "advanceAmount", "gpayNumber", status, "createdAt")
      SELECT
        gen_random_uuid(),
        (v->>'bookingCode')::text,
        (v->>'groupId')::uuid,
        (v->>'sid')::uuid,
        (v->>'customerName')::text,
        (v->>'customerPhone')::text,
        (v->>'totalAmount')::numeric,
        (v->>'adv')::numeric,
        (v->>'gpay')::text,
        'pending_payment',
        now()
      FROM json_array_elements(${JSON.stringify(bookingValues)}::json) AS v
    `

    return NextResponse.json({ success: true, slotCount: claimedIds.length })
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
      UPDATE bookings SET status = ${status}
      WHERE id = ${id} RETURNING *
    `
    const b = bookings[0]
    if (!b) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })

    if (status === 'confirmed') {
      await sql`UPDATE slots SET status='booked' WHERE id=${b.slotId}`
    } else if (status === 'cancelled') {
      if (b.groupId) {
        // Cancel all slots in the booking group at once
        await sql`UPDATE bookings SET status='cancelled' WHERE "groupId"=${b.groupId}`
        await sql`
          UPDATE slots SET status='available', "pendingExpiresAt"=null
          WHERE id IN (SELECT "slotId" FROM bookings WHERE "groupId"=${b.groupId})
        `
      } else {
        // Legacy: no groupId — cancel this booking only
        await sql`UPDATE bookings SET status='cancelled' WHERE id=${b.id}`
        await sql`UPDATE slots SET status='available', "pendingExpiresAt"=null WHERE id=${b.slotId}`
      }
    }
    return NextResponse.json(b)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}
