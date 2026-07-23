import {
  getAdminPortfolio,
  replaceActivities,
  replaceCertifications,
  replaceEducation,
  replaceExperience,
  replaceProjects,
  replaceSkills,
  replaceTechStack,
  updateProfile,
  updateSettings,
} from '@portfolio/cms'
import { isAdminAuthenticated, unauthorized } from '@/lib/admin-auth'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export const dynamic = 'force-dynamic'

const ALLOWED_SECTIONS = [
  'profile',
  'projects',
  'skills',
  'experience',
  'education',
  'certifications',
  'activities',
  'techStack',
  'settings',
] as const
type Section = (typeof ALLOWED_SECTIONS)[number]

export async function GET(_req: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  if (!(await isAdminAuthenticated())) return unauthorized()
  const { section } = await params
  if (!ALLOWED_SECTIONS.includes(section as Section)) {
    return NextResponse.json({ success: false, error: 'NOT_FOUND' }, { status: 404 })
  }
  const data = await getAdminPortfolio()
  return NextResponse.json({ success: true, data: data[section as Section] })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  if (!(await isAdminAuthenticated())) return unauthorized()
  const { section } = await params
  if (!ALLOWED_SECTIONS.includes(section as Section)) {
    return NextResponse.json({ success: false, error: 'NOT_FOUND' }, { status: 404 })
  }
  try {
    const body = await req.json()
    const updated = await updateSection(section as Section, body)
    return NextResponse.json({ success: true, data: updated[section as Section] })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: 'VALIDATION_ERROR', issues: err.issues }, { status: 400 })
    }
    console.error(`[portfolio/${section} PUT]`, err)
    return NextResponse.json({ success: false, error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}

async function updateSection(section: Section, body: unknown) {
  switch (section) {
    case 'profile':
      return updateProfile(body as never)
    case 'projects':
      return replaceProjects(body as never)
    case 'skills':
      return replaceSkills(body as never)
    case 'experience':
      return replaceExperience(body as never)
    case 'education':
      return replaceEducation(body as never)
    case 'certifications':
      return replaceCertifications(body as never)
    case 'activities':
      return replaceActivities(body as never)
    case 'techStack':
      return replaceTechStack(body as never)
    case 'settings':
      return updateSettings(body as never)
  }
}
