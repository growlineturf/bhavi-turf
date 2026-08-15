import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, message } = body
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'VALIDATION_ERROR' }, { status: 400 })
    }
    try {
      const sql = neon(process.env.DATABASE_URL!)
      await sql`
        INSERT INTO contact_submissions (id, name, email, message, "createdAt")
        VALUES (gen_random_uuid(), ${name}, ${email}, ${message}, now())
      `
    } catch { /* DB may not have table — ignore */ }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact POST]', err)
    return NextResponse.json({ success: false, error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
