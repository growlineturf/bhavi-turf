import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Read file bytes
    const arrayBuffer = await file.arrayBuffer()
    const bytes = Buffer.from(arrayBuffer)

    const sql = neon(process.env.DATABASE_URL!)

    // Ensure assets table exists
    await sql`CREATE TABLE IF NOT EXISTS assets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      filename TEXT NOT NULL DEFAULT 'file',
      "mimeType" TEXT NOT NULL DEFAULT 'application/octet-stream',
      data BYTEA NOT NULL,
      "createdAt" TIMESTAMPTZ DEFAULT NOW()
    )`

    // Insert and return id
    const rows = await sql`
      INSERT INTO assets (filename, "mimeType", data)
      VALUES (${file.name || 'upload'}, ${file.type || 'application/octet-stream'}, ${bytes})
      RETURNING id
    `
    const id = rows[0].id as string
    const ext = (file.name || '').split('.').pop() || 'jpg'
    const url = `/api/assets/${id}.${ext}`

    return NextResponse.json({ url, id })
  } catch (e) {
    console.error('[upload]', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
