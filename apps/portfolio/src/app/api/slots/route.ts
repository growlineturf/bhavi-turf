import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SPORTS = ['Cricket', 'Football']
const SLOT_DURATION = 60 // minutes
const PRICE_BY_HOUR: Record<number, number> = {
  5: 400, 6: 400, 7: 400,           // Twilight 5-8
  8: 600, 9: 600, 10: 600, 11: 600, // Morning 8-12
  12: 500, 13: 500, 14: 500, 15: 500, // Noon 12-16
  16: 800, 17: 800, 18: 800, 19: 800, // Evening 16-20
  20: 800, 21: 800, 22: 800, 23: 800,
}

function generateSlots(dateStr: string) {
  const slots = []
  for (const sport of SPORTS) {
    for (let h = 5; h < 23; h++) {
      const start = `${String(h).padStart(2, '0')}:00`
      const end = `${String(h + 1).padStart(2, '0')}:00`
      slots.push({
        date: new Date(dateStr),
        startTime: start,
        endTime: end,
        sport,
        price: PRICE_BY_HOUR[h] ?? 600,
        status: 'available',
      })
    }
  }
  return slots
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const dateStr = searchParams.get('date')
  if (!dateStr) return NextResponse.json({ error: 'date required' }, { status: 400 })

  const date = new Date(dateStr)

  // Auto-generate slots if none exist for this date
  let slots = await prisma.slot.findMany({ where: { date } })
  if (slots.length === 0) {
    await prisma.slot.createMany({ data: generateSlots(dateStr), skipDuplicates: true })
    slots = await prisma.slot.findMany({ where: { date } })
  }

  // Reset expired pending slots
  const now = new Date()
  await prisma.slot.updateMany({
    where: { date, status: 'pending', pendingExpiresAt: { lt: now } },
    data: { status: 'available', pendingExpiresAt: null },
  })

  slots = await prisma.slot.findMany({ where: { date }, orderBy: [{ startTime: 'asc' }, { sport: 'asc' }] })
  return NextResponse.json(slots)
}

// Admin force-toggle slot
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  const slot = await prisma.slot.update({ where: { id }, data: { status } })
  return NextResponse.json(slot)
}
