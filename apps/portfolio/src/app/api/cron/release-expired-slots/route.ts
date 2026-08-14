import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()

  // Find expired pending slots
  const expiredSlots = await prisma.slot.findMany({
    where: { status: 'pending', pendingExpiresAt: { lt: now } },
    include: { bookings: { where: { status: 'pending_payment' } } },
  })

  let released = 0
  for (const slot of expiredSlots) {
    await prisma.$transaction([
      // Reset slot to available
      prisma.slot.update({
        where: { id: slot.id },
        data: { status: 'available', pendingExpiresAt: null },
      }),
      // Mark linked bookings as expired
      ...slot.bookings.map(b =>
        prisma.booking.update({
          where: { id: b.id },
          data: { status: 'expired' },
        })
      ),
    ])
    released++
  }

  return NextResponse.json({ released, timestamp: now.toISOString() })
}
