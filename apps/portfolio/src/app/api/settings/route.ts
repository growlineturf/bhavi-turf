import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })
  return NextResponse.json(settings)
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const settings = await prisma.settings.upsert({
    where: { id: 'singleton' },
    update: body,
    create: { id: 'singleton', updatedAt: new Date(), ...body },
  })
  return NextResponse.json(settings)
}
