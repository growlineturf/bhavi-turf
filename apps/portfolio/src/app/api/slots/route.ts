import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const SPORTS = ['Cricket']

// Price per HOUR — slot price will be halved for 30-min slots
const PRICE_BY_HOUR: Record<number, number> = {
  5: 400, 6: 400, 7: 400,
  8: 600, 9: 600, 10: 600, 11: 600,
  12: 500, 13: 500, 14: 500, 15: 500,
  16: 800, 17: 800, 18: 800, 19: 800,
  20: 800, 21: 800, 22: 800,
}

const EXPECTED_SLOTS = 18 * 1 * 2 // 18 hours × 1 sport × 2 sub-slots = 36

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!)
  const { searchParams } = new URL(req.url)
  const dateStr = searchParams.get('date')
  if (!dateStr) return NextResponse.json({ error: 'date required' }, { status: 400 })

  try {
    // Check if 30-min slots already exist
    const existing = await sql`SELECT id FROM slots WHERE date::date = ${dateStr}::date`

    if (existing.length < EXPECTED_SLOTS) {
      // Delete OLD-FORMAT slots (hourly, duration > 30 min) that have no bookings
      await sql`
        DELETE FROM slots
        WHERE date::date = ${dateStr}::date
          AND id NOT IN (SELECT DISTINCT "slotId" FROM bookings WHERE "slotId" IS NOT NULL)
          AND (
            (split_part("endTime", ':', 1)::int * 60 + split_part("endTime", ':', 2)::int)
            - (split_part("startTime", ':', 1)::int * 60 + split_part("startTime", ':', 2)::int)
          ) > 30
      `

      // Build ALL 72 slot definitions in JS, then insert as ONE query via JSON
      type SlotDef = { sport: string; start: string; end: string; price: number }
      const defs: SlotDef[] = []
      for (const sport of SPORTS) {
        for (let h = 5; h < 23; h++) {
          const hStr = String(h).padStart(2, '0')
          const nxh  = String(h + 1).padStart(2, '0')
          const price = Math.round((PRICE_BY_HOUR[h] ?? 600) / 2)
          defs.push({ sport, start: `${hStr}:00`, end: `${hStr}:30`, price })
          defs.push({ sport, start: `${hStr}:30`, end: `${nxh}:00`,  price })
        }
      }

      // Single INSERT — skip any slot that already exists (startTime + endTime + sport)
      await sql`
        INSERT INTO slots (id, date, "startTime", "endTime", sport, price, status, "createdAt")
        SELECT
          gen_random_uuid(),
          ${dateStr}::date,
          (d->>'start')::text,
          (d->>'end')::text,
          (d->>'sport')::text,
          (d->>'price')::int,
          'available',
          now()
        FROM json_array_elements(${JSON.stringify(defs)}::json) AS d
        WHERE NOT EXISTS (
          SELECT 1 FROM slots s
          WHERE s.date::date = ${dateStr}::date
            AND s."startTime" = (d->>'start')::text
            AND s."endTime"   = (d->>'end')::text
            AND s.sport       = (d->>'sport')::text
        )
      `
    }


    // Release expired pending slots
    await sql`
      UPDATE slots SET status='available', "pendingExpiresAt"=null
      WHERE date::date = ${dateStr}::date
        AND status='pending'
        AND "pendingExpiresAt" < now()
    `

    const slots = await sql`
      SELECT * FROM slots
      WHERE date::date = ${dateStr}::date
      ORDER BY sport ASC, "startTime" ASC
    `
    return NextResponse.json(slots)
  } catch (e) {
    console.error(e)
    return NextResponse.json([], { status: 500 })
  }
}

// Admin: toggle slot status OR update price OR bulk-update price by time period
export async function PATCH(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!)
  const body = await req.json()

  try {
    // ── Bulk period pricing: { date, sport, startHour, endHour, price } ──────
    if (body.date && body.sport && body.price !== undefined && body.startHour !== undefined) {
      const { date, sport, startHour, endHour, price } = body
      const rows = await sql`
        UPDATE slots SET price = ${Number(price)}
        WHERE date::date = ${date}::date
          AND sport = ${sport}
          AND split_part("startTime", ':', 1)::int >= ${startHour}
          AND split_part("startTime", ':', 1)::int <= ${endHour}
          AND status != 'booked'
        RETURNING id, "startTime", price
      `
      return NextResponse.json({ updated: rows.length, rows })
    }

    // ── Single slot price update: { id, price } ───────────────────────────────
    if (body.id && body.price !== undefined && !body.status) {
      const rows = await sql`
        UPDATE slots SET price = ${Number(body.price)}
        WHERE id = ${body.id}
        RETURNING *
      `
      return NextResponse.json(rows[0])
    }

    // ── Single slot status toggle: { id, status } ─────────────────────────────
    if (body.id && body.status) {
      const rows = await sql`
        UPDATE slots SET status = ${body.status}
        WHERE id = ${body.id}
        RETURNING *
      `
      return NextResponse.json(rows[0])
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}

// Admin: reset stuck/pending/blocked slots back to available for a date + sport
export async function DELETE(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!)
  const body = await req.json()
  const { date, sport } = body
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

  try {
    const filter = sport
      ? sql`AND sport = ${sport}`
      : sql``

    const rows = await sql`
      UPDATE slots
      SET status = 'available', "pendingExpiresAt" = null
      WHERE date::date = ${date}::date
        AND status IN ('pending', 'blocked')
        ${filter}
      RETURNING id, "startTime", status
    `
    return NextResponse.json({ reset: rows.length, slots: rows })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}
