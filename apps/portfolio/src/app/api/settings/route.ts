import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureColumns(sql: any) {
  // Add new columns safely — idempotent, runs on first request
  await sql`ALTER TABLE settings ADD COLUMN IF NOT EXISTS "heroTitle"     TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE settings ADD COLUMN IF NOT EXISTS "heroTagline"   TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE settings ADD COLUMN IF NOT EXISTS "heroBannerUrl" TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE settings ADD COLUMN IF NOT EXISTS "logoUrl"       TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE settings ADD COLUMN IF NOT EXISTS "logoText"      TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE settings ADD COLUMN IF NOT EXISTS "openingHours"  TEXT NOT NULL DEFAULT '5 AM – 11 PM'`
  await sql`ALTER TABLE settings ADD COLUMN IF NOT EXISTS "googleMapsUrl" TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE settings ADD COLUMN IF NOT EXISTS "instagramUrl"  TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE settings ADD COLUMN IF NOT EXISTS "primaryColor"  TEXT NOT NULL DEFAULT '#3b82f6'`
  await sql`ALTER TABLE settings ADD COLUMN IF NOT EXISTS "sportsOffered" TEXT NOT NULL DEFAULT 'Cricket, Football'`
}

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!)
  try {
    await ensureColumns(sql)
    const rows = await sql`SELECT * FROM settings WHERE id='singleton' LIMIT 1`
    return NextResponse.json(rows[0] ?? null)
  } catch (e) {
    console.error(e)
    return NextResponse.json(null, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!)
  const b = await req.json()

  try {
    await ensureColumns(sql)
    const rows = await sql`
      INSERT INTO settings (
        id, "turfName", city, "whatsappNumber", "gpayNumber", "advanceAmount",
        "heroTitle", "heroTagline", "heroBannerUrl",
        "logoUrl", "logoText", "openingHours", "googleMapsUrl", "instagramUrl",
        "primaryColor", "sportsOffered", "updatedAt"
      )
      VALUES (
        'singleton',
        ${b.turfName       ?? 'Turf Arena'},
        ${b.city           ?? ''},
        ${b.whatsappNumber ?? ''},
        ${b.gpayNumber     ?? ''},
        ${b.advanceAmount  ?? 500},
        ${b.heroTitle      ?? ''},
        ${b.heroTagline    ?? ''},
        ${b.heroBannerUrl  ?? ''},
        ${b.logoUrl        ?? ''},
        ${b.logoText       ?? ''},
        ${b.openingHours   ?? '5 AM – 11 PM'},
        ${b.googleMapsUrl  ?? ''},
        ${b.instagramUrl   ?? ''},
        ${b.primaryColor   ?? '#3b82f6'},
        ${b.sportsOffered  ?? 'Cricket, Football'},
        now()
      )
      ON CONFLICT (id) DO UPDATE SET
        "turfName"       = EXCLUDED."turfName",
        city             = EXCLUDED.city,
        "whatsappNumber" = EXCLUDED."whatsappNumber",
        "gpayNumber"     = EXCLUDED."gpayNumber",
        "advanceAmount"  = EXCLUDED."advanceAmount",
        "heroTitle"      = EXCLUDED."heroTitle",
        "heroTagline"    = EXCLUDED."heroTagline",
        "heroBannerUrl"  = EXCLUDED."heroBannerUrl",
        "logoUrl"        = EXCLUDED."logoUrl",
        "logoText"       = EXCLUDED."logoText",
        "openingHours"   = EXCLUDED."openingHours",
        "googleMapsUrl"  = EXCLUDED."googleMapsUrl",
        "instagramUrl"   = EXCLUDED."instagramUrl",
        "primaryColor"   = EXCLUDED."primaryColor",
        "sportsOffered"  = EXCLUDED."sportsOffered",
        "updatedAt"      = now()
      RETURNING *
    `
    return NextResponse.json(rows[0])
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}
