import { getAsset } from '@portfolio/cms'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/assets/[id] — stream an uploaded asset (portrait, project covers, résumé, …).
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params
  const id = raw.replace(/\.[^.]+$/, '') // strip the extension suffix
  const asset = await getAsset(id)
  if (!asset) return new Response('Not found', { status: 404 })

  const bytes = new Uint8Array(asset.data as Uint8Array)
  return new Response(bytes, {
    headers: {
      'Content-Type': asset.mimeType || 'application/octet-stream',
      'Content-Length': String(bytes.byteLength),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Disposition': `inline; filename="${(asset.filename || 'file').replace(/["\\]/g, '')}"`,
    },
  })
}
