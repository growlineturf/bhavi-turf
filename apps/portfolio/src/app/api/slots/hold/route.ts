import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { slotId } = await req.json()
  if (!slotId) return NextResponse.json({ error: 'slotId required' }, { status: 400 })

  const pendingExpiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

  try {
    const slot = await prisma.$transaction(async (tx) => {
      const current = await tx.slot.findUnique({ where: { id: slotId } })
      if (!current || current.status !== 'available') {
        throw new Error('SLOT_TAKEN')
      }
      return tx.slot.update({
        where: { id: slotId },
        data: { status: 'pending', pendingExpiresAt },
      })
    })
    return NextResponse.json({ slot, pendingExpiresAt })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'SLOT_TAKEN') {
      return NextResponse.json({ error: 'SLOT_TAKEN' }, { status: 409 })
    }
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}
