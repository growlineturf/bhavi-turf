import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

function db() { return neon(process.env.DATABASE_URL!) }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureTable(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS five_over_bookings (
      id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      "bookingCode"   TEXT        NOT NULL,
      "customerName"  TEXT        NOT NULL DEFAULT '',
      "customerPhone" TEXT        NOT NULL DEFAULT '',
      "bookingDate"   TEXT        NOT NULL,
      "bookingTime"   TEXT        NOT NULL,
      "bookingType"   TEXT        NOT NULL DEFAULT '5_over',
      "serviceName"   TEXT        NOT NULL DEFAULT '5 Over – 30 Balls',
      price           NUMERIC     NOT NULL DEFAULT 100,
      "gpayNumber"    TEXT        NOT NULL DEFAULT '',
      status          TEXT        NOT NULL DEFAULT 'pending_payment',
      "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
}

/* ── POST: save a 5-over booking — NEVER touches the slots table ── */
export async function POST(req: NextRequest) {
  const sql  = db()
  const body = await req.json()
  const { date, time, customerName, customerPhone, serviceName, price, gpayNumber } = body
  if (!date || !time) {
    return NextResponse.json({ error: 'date and time are required' }, { status: 400 })
  }
  try {
    await ensureTable(sql)
    const bookingCode = crypto.randomUUID()
    await sql`
      INSERT INTO five_over_bookings
        ("bookingCode","customerName","customerPhone","bookingDate","bookingTime",
         "bookingType","serviceName",price,"gpayNumber",status,"createdAt")
      VALUES (
        ${bookingCode}, ${customerName ?? ''}, ${customerPhone ?? ''},
        ${date}, ${time}, '5_over',
        ${serviceName ?? '5 Over – 30 Balls'}, ${price ?? 100},
        ${gpayNumber ?? ''}, 'pending_payment', now()
      )
    `
    return NextResponse.json({ success: true, bookingCode })
  } catch (e) {
    console.error('[5-over POST]', e)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}

/* ── GET: list all 5-over bookings (admin use) ── */
export async function GET() {
  const sql = db()
  try {
    await ensureTable(sql)
    const rows = await sql`SELECT * FROM five_over_bookings ORDER BY "createdAt" DESC LIMIT 200`
    return NextResponse.json(rows)
  } catch (e) {
    console.error('[5-over GET]', e)
    return NextResponse.json([], { status: 500 })
  }
}

/* ── PATCH: confirm or cancel a 5-over booking (admin use) ── */
export async function PATCH(req: NextRequest) {
  const sql = db()
  const { id, status } = await req.json()
  if (!id || !status) {
    return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
  }
  try {
    await ensureTable(sql)
    const rows = await sql`
      UPDATE five_over_bookings SET status = ${status} WHERE id = ${id} RETURNING *
    `
    if (!rows[0]) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
    return NextResponse.json(rows[0])
  } catch (e) {
    console.error('[5-over PATCH]', e)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}
