import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function genBookingCode() {
  return `BK-${Math.floor(1000 + Math.random() * 9000)}`
}

// GET all bookings (admin)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const bookings = await prisma.booking.findMany({
    where: status ? { status } : undefined,
    include: { slot: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  return NextResponse.json(bookings)
}

// POST — create booking (customer)
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { slotId, customerName, customerPhone, gpayNumber, totalAmount, advanceAmount } = body

  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findUnique({ where: { id: slotId } })
      if (!slot || (slot.status !== 'pending' && slot.status !== 'available')) {
        throw new Error('SLOT_UNAVAILABLE')
      }

      const newBooking = await tx.booking.create({
        data: {
          bookingCode: genBookingCode(),
          slotId,
          customerName,
          customerPhone,
          totalAmount,
          advanceAmount: advanceAmount ?? settings?.advanceAmount ?? 500,
          gpayNumber: gpayNumber ?? settings?.gpayNumber ?? '',
          status: 'pending_payment',
        },
        include: { slot: true },
      })

      await tx.slot.update({ where: { id: slotId }, data: { status: 'booked', pendingExpiresAt: null } })

      return newBooking
    })

    return NextResponse.json(booking)
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'SLOT_UNAVAILABLE') {
      return NextResponse.json({ error: 'SLOT_UNAVAILABLE' }, { status: 409 })
    }
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}

// PATCH — admin confirm/cancel booking
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  const booking = await prisma.$transaction(async (tx) => {
    const updated = await tx.booking.update({
      where: { id },
      data: {
        status,
        confirmedAt: status === 'confirmed' ? new Date() : undefined,
        confirmedByAdmin: status === 'confirmed' ? true : undefined,
      },
      include: { slot: true },
    })
    // Update slot status accordingly
    if (status === 'confirmed') {
      await tx.slot.update({ where: { id: updated.slotId }, data: { status: 'booked' } })
    } else if (status === 'cancelled') {
      await tx.slot.update({ where: { id: updated.slotId }, data: { status: 'available', pendingExpiresAt: null } })
    }
    return updated
  })
  return NextResponse.json(booking)
}
