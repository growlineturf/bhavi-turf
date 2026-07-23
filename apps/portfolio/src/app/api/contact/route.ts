import { submitContact } from '@portfolio/cms'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await submitContact(body)
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        issues: err.issues,
      }, { status: 400 })
    }
    console.error('[contact POST]', err)
    return NextResponse.json({ success: false, error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
