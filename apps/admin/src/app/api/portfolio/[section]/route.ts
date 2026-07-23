import {
  getAdminPortfolio,
  replaceCertifications,
  replaceExperience,
  replaceProjects,
  replaceSkills,
  updateProfile,
} from '@portfolio/cms'
import { isAdminAuthenticated, unauthorized } from '@/lib/admin-auth'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_SECTIONS = ['profile', 'projects', 'skills', 'experience', 'certifications'] as const
type Section = typeof ALLOWED_SECTIONS[number]

// GET /api/portfolio/[section]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  if (!(await isAdminAuthenticated())) return unauthorized()
  const { section } = await params
  if (!ALLOWED_SECTIONS.includes(section as Section)) {
    return NextResponse.json({ success: false, error: 'NOT_FOUND' }, { status: 404 })
  }
  const sectionKey = section as Section
  const data = await getAdminPortfolio()
  return NextResponse.json({ success: true, data: data[sectionKey] })
}

// PUT /api/portfolio/[section]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
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
    console.error(`[portfolio/${section} PUT]`, err)
    return NextResponse.json({ success: false, error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}

async function updateSection(section: Section, body: unknown) {
  if (section === 'profile') return updateProfile(body as never)
  if (section === 'projects') return replaceProjects(body as never)
  if (section === 'skills') return replaceSkills(body as never)
  if (section === 'experience') return replaceExperience(body as never)
  return replaceCertifications(body as never)
}
