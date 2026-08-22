import { NextResponse } from 'next/server'

export async function GET() {
  const manifest = {
    name: 'BHAVI Admin',
    short_name: 'BHAVI Admin',
    description: 'BHAVI TURF Admin Dashboard — manage bookings & revenue.',
    start_url: '/admin',
    scope: '/admin',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#1d4ed8',
    orientation: 'portrait',
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
