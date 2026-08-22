import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET() {
  let pwaName = 'BHAVI'
  let shortName = 'BHAVI'
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql`SELECT "pwaName", "turfName" FROM settings WHERE id='singleton' LIMIT 1`
    if (rows[0]) {
      pwaName  = rows[0].pwaName  || rows[0].turfName || 'BHAVI'
      shortName = rows[0].pwaName || 'BHAVI'
    }
  } catch { /* fallback to defaults */ }

  const manifest = {
    name: pwaName,
    short_name: shortName,
    description: 'Book indoor cricket turf slots online — fast & easy.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    orientation: 'portrait',
    categories: ['sports', 'lifestyle'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  }

  return new NextResponse(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
