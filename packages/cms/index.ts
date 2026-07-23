import { del, put } from '@vercel/blob'
import { cacheInvalidate, CacheKeys, TTL, withCache } from '@portfolio/cache'
import { prisma } from '@portfolio/database'
import {
  activitySchema,
  certificationSchema,
  contactSchema,
  educationSchema,
  experienceSchema,
  portfolioUpdateSchema,
  profileSchema,
  projectSchema,
  settingsSchema,
  skillSchema,
  techStackSchema,
  type ActivityInput,
  type CertificationInput,
  type ContactInput,
  type EducationInput,
  type ExperienceInput,
  type ProfileInput,
  type ProjectInput,
  type SettingsInput,
  type SkillInput,
  type TechStackInput,
} from '@portfolio/validators'
import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto'

const DEFAULT_SLUG = 'abarna'
const ADMIN_EMAIL = 'admin@portfolio.local'
const SESSION_COOKIE = 'portfolio_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7

export type PublicProfileDTO = {
  name: string
  title: string
  tagline: string
  summary: string
  avatarUrl: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  openToWork: boolean
  availabilityText: string
  resumeUrl: string
}

export type ProjectDTO = ProjectInput & { id: string }
export type SkillDTO = SkillInput & { id: string }
export type ExperienceDTO = ExperienceInput & { id: string }
export type CertificationDTO = CertificationInput & { id: string }
export type ActivityDTO = {
  id: string
  title: string
  description: string
  type: string
  year: string
}

export type TechStackDTO = {
  id: string
  name: string
  iconSlug: string
}

export type EducationDTO = {
  id: string
  institution: string
  degree: string
  field: string
  grade: string
  location: string
  startYear: string
  endYear: string
  period: string
}

export type SettingsDTO = SettingsInput

export type PublicPortfolioDTO = {
  profile: PublicProfileDTO
  projects: ProjectDTO[]
  skills: SkillDTO[]
  experience: ExperienceDTO[]
  education: EducationDTO[]
  certifications: CertificationDTO[]
  activities: ActivityDTO[]
  techStack: TechStackDTO[]
  settings: SettingsDTO
}

export type AdminPortfolioDTO = PublicPortfolioDTO

export type ResumeStatusDTO = {
  exists: boolean
  url: string
}

export { SESSION_COOKIE, SESSION_MAX_AGE }

function monthYear(date?: Date | null) {
  if (!date) return ''
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date)
}

function dateRange(start?: Date | null, end?: Date | null, isCurrent?: boolean) {
  const from = monthYear(start)
  const to = isCurrent ? 'Present' : monthYear(end)
  return [from, to].filter(Boolean).join(' – ')
}

function projectYear(start?: Date | null, end?: Date | null) {
  const date = end || start
  return date ? String(date.getFullYear()) : ''
}

function dateFromYear(year?: string) {
  if (!year || !/^\d{4}$/.test(year)) return null
  return new Date(`${year}-01-01T00:00:00.000Z`)
}

function assertDatabaseConfigured() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required before loading portfolio CMS data')
  }
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/)
  const firstName = parts[0] || name.trim()
  const lastName = parts.slice(1).join(' ')
  const fullName = [firstName, lastName].filter(Boolean).join(' ')
  const initials = parts.map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  return { firstName, lastName, fullName, initials: initials ? `${initials}.` : 'AS.' }
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || `project-${Date.now()}`
}

function toAdminExperienceType(value: string): ExperienceInput['type'] {
  if (value === 'FULLTIME') return 'FULL_TIME'
  if (value === 'PARTTIME') return 'PART_TIME'
  return experienceSchema.shape.type.safeParse(value).success
    ? (value as ExperienceInput['type'])
    : 'INTERNSHIP'
}

function toDbExperienceType(value: ExperienceInput['type']) {
  if (value === 'FULL_TIME') return 'FULLTIME'
  if (value === 'PART_TIME') return 'PARTTIME'
  return value
}

async function getSettings() {
  const existing = await prisma.siteSettings.findFirst()
  if (existing) return existing
  return prisma.siteSettings.create({ data: {} })
}

async function getPortfolioRecord(slug = DEFAULT_SLUG) {
  assertDatabaseConfigured()

  const [portfolio, settings] = await Promise.all([
    prisma.portfolio.findUnique({
      where: { slug },
      include: {
        skills: { orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] },
        projects: { orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] },
        experiences: { orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }] },
        educations: { orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] },
        certifications: { orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] },
        activities: { orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] },
        techStack: { orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] },
      },
    }),
    getSettings(),
  ])

  if (!portfolio) throw new Error(`Portfolio "${slug}" was not found`)
  return { portfolio, settings }
}

function mapPortfolio(data: Awaited<ReturnType<typeof getPortfolioRecord>>): PublicPortfolioDTO {
  const { portfolio, settings } = data
  const name = portfolio.fullName || [portfolio.firstName, portfolio.lastName].filter(Boolean).join(' ')

  return {
    profile: {
      name,
      title: portfolio.title,
      tagline: portfolio.tagline,
      summary: portfolio.summary,
      avatarUrl: portfolio.avatarUrl || '',
      email: portfolio.email,
      phone: portfolio.phone || '',
      location: portfolio.location,
      linkedin: portfolio.linkedinUrl || '',
      github: portfolio.githubUrl || '',
      openToWork: settings.openToWork,
      availabilityText: settings.availabilityText,
      resumeUrl: portfolio.resumeUrl || '',
    },
    projects: portfolio.projects.map((project) => ({
      id: project.id,
      title: project.title,
      role: project.role || '',
      problem: project.problem,
      solution: project.solution,
      outcome: project.outcome || '',
      description: project.description,
      thumbnailUrl: project.thumbnailUrl || '',
      imageUrls: project.imageUrls,
      techStack: project.techStack,
      tags: project.tags,
      metricHighlights: project.metricHighlights,
      status: project.status,
      year: projectYear(project.startDate, project.endDate),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      playStoreUrl: project.playStoreUrl || '',
      platforms: project.platforms,
      timeline: (project.timeline as ProjectInput['timeline']) ?? [],
      team: (project.team as ProjectInput['team']) ?? [],
      featured: project.isFeatured,
    })),
    skills: portfolio.skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      iconSlug: skill.iconSlug || '',
    })),
    experience: portfolio.experiences.map((experience) => ({
      id: experience.id,
      company: experience.company,
      role: experience.role,
      period: experience.period || dateRange(experience.startDate, experience.endDate, experience.isCurrent),
      type: toAdminExperienceType(experience.type),
      location: experience.location || '',
      highlights: experience.highlights,
      tech: experience.techStack,
    })),
    education: portfolio.educations.map((education) => ({
      id: education.id,
      institution: education.institution,
      degree: education.degree,
      field: education.field,
      grade: education.grade || '',
      location: education.location || '',
      startYear: education.startDate ? String(education.startDate.getFullYear()) : '',
      endYear: education.endDate ? String(education.endDate.getFullYear()) : '',
      period: dateRange(education.startDate, education.endDate, education.isCurrent),
    })),
    certifications: portfolio.certifications.map((certification) => ({
      id: certification.id,
      name: certification.name,
      issuer: certification.issuer,
      date: certification.displayDate || monthYear(certification.issuedDate),
      credentialUrl: certification.credentialUrl || '',
      imageUrl: certification.imageUrl || '',
    })),
    activities: portfolio.activities.map((activity) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description || '',
      type: activity.type,
      year: activity.year != null ? String(activity.year) : '',
    })),
    techStack: portfolio.techStack.map((item) => ({
      id: item.id,
      name: item.name,
      iconSlug: item.iconSlug,
    })),
    settings: {
      openToWork: settings.openToWork,
      availabilityText: settings.availabilityText,
      contactFormEnabled: settings.contactFormEnabled,
      chatbotEnabled: settings.chatbotEnabled,
      chatbotName: settings.chatbotName,
      chatbotGreeting: settings.chatbotGreeting,
    },
  }
}

async function readPortfolio(slug = DEFAULT_SLUG) {
  return mapPortfolio(await getPortfolioRecord(slug))
}

export async function getPublicPortfolio(slug = DEFAULT_SLUG) {
  return withCache(
    CacheKeys.portfolio(slug),
    TTL.PORTFOLIO_FULL,
    () => readPortfolio(slug)
  )
}

export async function getAdminPortfolio(slug = DEFAULT_SLUG) {
  return readPortfolio(slug)
}

async function invalidatePortfolio(slug = DEFAULT_SLUG) {
  await cacheInvalidate([...CacheKeys.groups.allPortfolio(slug), CacheKeys.siteSettings()])
}

export async function updateProfile(input: ProfileInput, slug = DEFAULT_SLUG) {
  const profile = profileSchema.parse(input)
  const nameParts = splitName(profile.name)

  await prisma.$transaction(async (tx) => {
    await tx.portfolio.update({
      where: { slug },
      data: {
        ...nameParts,
        title: profile.title,
        tagline: profile.tagline,
        summary: profile.summary,
        avatarUrl: profile.avatarUrl || null,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        linkedinUrl: profile.linkedin,
        githubUrl: profile.github,
      },
    })

    const settings = await tx.siteSettings.findFirst()
    if (settings) {
      await tx.siteSettings.update({
        where: { id: settings.id },
        data: {
          openToWork: profile.openToWork,
          availabilityText: profile.availabilityText || 'Open to full-time opportunities from 2026',
        },
      })
    } else {
      await tx.siteSettings.create({
        data: {
          openToWork: profile.openToWork,
          availabilityText: profile.availabilityText || 'Open to full-time opportunities from 2026',
        },
      })
    }
  })

  await invalidatePortfolio(slug)
  return getAdminPortfolio(slug)
}

export async function replaceProjects(input: ProjectInput[], slug = DEFAULT_SLUG) {
  const projects = input.map((project) => projectSchema.parse(project))
  const portfolio = await prisma.portfolio.findUniqueOrThrow({ where: { slug }, select: { id: true } })

  await prisma.$transaction(async (tx) => {
    await tx.project.deleteMany({ where: { portfolioId: portfolio.id } })
    await tx.project.createMany({
      data: projects.map((project, index) => ({
        portfolioId: portfolio.id,
        title: project.title,
        slug: `${slugify(project.title)}-${index + 1}`,
        role: project.role || null,
        problem: project.problem,
        solution: project.solution,
        outcome: project.outcome || null,
        description: project.description || project.solution || project.problem,
        thumbnailUrl: project.thumbnailUrl || null,
        imageUrls: project.imageUrls,
        techStack: project.techStack,
        tags: project.tags,
        metricHighlights: project.metricHighlights,
        status: project.status,
        startDate: dateFromYear(project.year),
        githubUrl: project.githubUrl || null,
        liveUrl: project.liveUrl || null,
        playStoreUrl: project.playStoreUrl || null,
        platforms: project.platforms,
        timeline: project.timeline,
        team: project.team,
        isFeatured: project.featured,
        displayOrder: index + 1,
      })),
    })
  })

  await invalidatePortfolio(slug)
  return getAdminPortfolio(slug)
}

export async function replaceSkills(input: SkillInput[], slug = DEFAULT_SLUG) {
  const skills = input.map((skill) => skillSchema.parse(skill))
  const portfolio = await prisma.portfolio.findUniqueOrThrow({ where: { slug }, select: { id: true } })

  await prisma.$transaction(async (tx) => {
    await tx.skill.deleteMany({ where: { portfolioId: portfolio.id } })
    await tx.skill.createMany({
      data: skills.map((skill, index) => ({
        portfolioId: portfolio.id,
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        iconSlug: skill.iconSlug || null,
        displayOrder: index + 1,
      })),
    })
  })

  await invalidatePortfolio(slug)
  return getAdminPortfolio(slug)
}

export async function replaceExperience(input: ExperienceInput[], slug = DEFAULT_SLUG) {
  const experience = input.map((item) => experienceSchema.parse(item))
  const portfolio = await prisma.portfolio.findUniqueOrThrow({ where: { slug }, select: { id: true } })

  await prisma.$transaction(async (tx) => {
    await tx.experience.deleteMany({ where: { portfolioId: portfolio.id } })
    await tx.experience.createMany({
      data: experience.map((item, index) => ({
        portfolioId: portfolio.id,
        company: item.company,
        role: item.role,
        period: item.period,
        type: toDbExperienceType(item.type),
        location: item.location || null,
        description: item.highlights.join('\n') || `${item.role} at ${item.company}`,
        highlights: item.highlights,
        techStack: item.tech,
        displayOrder: index + 1,
      })),
    })
  })

  await invalidatePortfolio(slug)
  return getAdminPortfolio(slug)
}

export async function replaceCertifications(input: CertificationInput[], slug = DEFAULT_SLUG) {
  const certifications = input.map((certification) => certificationSchema.parse(certification))
  const portfolio = await prisma.portfolio.findUniqueOrThrow({ where: { slug }, select: { id: true } })

  await prisma.$transaction(async (tx) => {
    await tx.certification.deleteMany({ where: { portfolioId: portfolio.id } })
    await tx.certification.createMany({
      data: certifications.map((certification, index) => ({
        portfolioId: portfolio.id,
        name: certification.name,
        issuer: certification.issuer,
        displayDate: certification.date,
        credentialUrl: certification.credentialUrl || null,
        imageUrl: certification.imageUrl || null,
        displayOrder: index + 1,
      })),
    })
  })

  await invalidatePortfolio(slug)
  return getAdminPortfolio(slug)
}

export async function replaceEducation(input: EducationInput[], slug = DEFAULT_SLUG) {
  const education = input.map((item) => educationSchema.parse(item))
  const portfolio = await prisma.portfolio.findUniqueOrThrow({ where: { slug }, select: { id: true } })

  await prisma.$transaction(async (tx) => {
    await tx.education.deleteMany({ where: { portfolioId: portfolio.id } })
    await tx.education.createMany({
      data: education.map((item, index) => ({
        portfolioId: portfolio.id,
        institution: item.institution,
        degree: item.degree,
        field: item.field,
        grade: item.grade || null,
        location: item.location || null,
        startDate: dateFromYear(item.startYear) || new Date(),
        endDate: dateFromYear(item.endYear),
        isCurrent: !item.endYear,
        displayOrder: index + 1,
      })),
    })
  })

  await invalidatePortfolio(slug)
  return getAdminPortfolio(slug)
}

export async function replaceActivities(input: ActivityInput[], slug = DEFAULT_SLUG) {
  const activities = input.map((item) => activitySchema.parse(item))
  const portfolio = await prisma.portfolio.findUniqueOrThrow({ where: { slug }, select: { id: true } })

  await prisma.$transaction(async (tx) => {
    await tx.activity.deleteMany({ where: { portfolioId: portfolio.id } })
    await tx.activity.createMany({
      data: activities.map((item, index) => ({
        portfolioId: portfolio.id,
        title: item.title,
        description: item.description || null,
        type: item.type,
        year: item.year ? Number.parseInt(item.year, 10) || null : null,
        displayOrder: index + 1,
      })),
    })
  })

  await invalidatePortfolio(slug)
  return getAdminPortfolio(slug)
}

export async function replaceTechStack(input: TechStackInput[], slug = DEFAULT_SLUG) {
  const items = input.map((item) => techStackSchema.parse(item))
  const portfolio = await prisma.portfolio.findUniqueOrThrow({ where: { slug }, select: { id: true } })

  await prisma.$transaction(async (tx) => {
    await tx.techStackItem.deleteMany({ where: { portfolioId: portfolio.id } })
    await tx.techStackItem.createMany({
      data: items.map((item, index) => ({
        portfolioId: portfolio.id,
        name: item.name,
        iconSlug: item.iconSlug || '',
        displayOrder: index + 1,
      })),
    })
  })

  await invalidatePortfolio(slug)
  return getAdminPortfolio(slug)
}

export async function updateSettings(input: SettingsInput, slug = DEFAULT_SLUG) {
  const settings = settingsSchema.parse(input)
  const data = {
    openToWork: settings.openToWork,
    availabilityText: settings.availabilityText || 'Open to Full-Time Roles',
    contactFormEnabled: settings.contactFormEnabled,
    chatbotEnabled: settings.chatbotEnabled,
    chatbotName: settings.chatbotName || undefined,
    chatbotGreeting: settings.chatbotGreeting || undefined,
  }

  const existing = await prisma.siteSettings.findFirst()
  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data })
  } else {
    await prisma.siteSettings.create({ data })
  }

  await invalidatePortfolio(slug)
  return getAdminPortfolio(slug)
}

export async function getContactSubmissions(limit = 100) {
  return prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' }, take: limit })
}

export async function markContactRead(id: string, isRead = true) {
  return prisma.contactSubmission.update({ where: { id }, data: { isRead } })
}

export async function deleteContactSubmission(id: string) {
  return prisma.contactSubmission.delete({ where: { id } })
}

export async function updatePortfolio(input: unknown, slug = DEFAULT_SLUG) {
  const parsed = portfolioUpdateSchema.parse(input)
  if (parsed.profile) await updateProfile(parsed.profile, slug)
  if (parsed.projects) await replaceProjects(parsed.projects, slug)
  if (parsed.skills) await replaceSkills(parsed.skills, slug)
  if (parsed.experience) await replaceExperience(parsed.experience, slug)
  if (parsed.education) await replaceEducation(parsed.education, slug)
  if (parsed.certifications) await replaceCertifications(parsed.certifications, slug)
  if (parsed.activities) await replaceActivities(parsed.activities, slug)
  if (parsed.techStack) await replaceTechStack(parsed.techStack, slug)
  if (parsed.settings) await updateSettings(parsed.settings, slug)
  return getAdminPortfolio(slug)
}

export async function getResumeStatus(slug = DEFAULT_SLUG): Promise<ResumeStatusDTO> {
  const portfolio = await prisma.portfolio.findUniqueOrThrow({
    where: { slug },
    select: { resumeUrl: true },
  })
  return { exists: Boolean(portfolio.resumeUrl), url: portfolio.resumeUrl || '' }
}

export async function uploadResume(file: File, slug = DEFAULT_SLUG) {
  if (file.type !== 'application/pdf') throw new Error('Only PDF files are allowed')
  if (file.size > 10 * 1024 * 1024) throw new Error('File too large (max 10MB)')
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is required for resume uploads')
  }

  const blob = await put(`resumes/${Date.now()}-${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  await prisma.portfolio.update({
    where: { slug },
    data: { resumeUrl: blob.url },
  })
  await invalidatePortfolio(slug)
  return { exists: true, url: blob.url }
}

export async function deleteResume(slug = DEFAULT_SLUG) {
  const current = await getResumeStatus(slug)
  if (current.url && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await del(current.url)
    } catch {
      // The DB should still stop advertising a stale resume URL.
    }
  }

  await prisma.portfolio.update({
    where: { slug },
    data: { resumeUrl: null },
  })
  await invalidatePortfolio(slug)
  return { exists: false, url: '' }
}

export async function submitContact(input: ContactInput) {
  const data = contactSchema.parse(input)
  return prisma.contactSubmission.create({ data })
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'portfolio-dev-secret'
}

function sign(value: string) {
  return createHmac('sha256', sessionSecret()).update(value).digest('base64url')
}

export function createSessionToken() {
  const payload = Buffer.from(JSON.stringify({
    sub: 'admin',
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token?: string | null) {
  if (!token) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false

  const expected = sign(payload)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return false
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as { exp?: number }
    return typeof data.exp === 'number' && data.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `scrypt:${salt}:${hash}`
}

function verifyPassword(password: string, storedHash: string) {
  const [, salt, stored] = storedHash.split(':')
  if (!salt || !stored) return false
  const candidate = scryptSync(password, salt, 64)
  const storedBuffer = Buffer.from(stored, 'hex')
  return candidate.length === storedBuffer.length && timingSafeEqual(candidate, storedBuffer)
}

async function ensureAdminUser() {
  const existing = await prisma.adminUser.findFirst({ where: { email: ADMIN_EMAIL } })
  if (existing) return existing
  return prisma.adminUser.create({
    data: {
      email: ADMIN_EMAIL,
      passwordHash: hashPassword(process.env.ADMIN_PASSWORD || 'admin123'),
    },
  })
}

export async function loginAdmin(password: string) {
  const admin = await ensureAdminUser()
  if (!verifyPassword(password, admin.passwordHash)) return null
  return createSessionToken()
}

export async function changeAdminPassword(currentPassword: string, newPassword: string) {
  if (!currentPassword || !newPassword) {
    throw new Error('Both current and new password are required')
  }
  if (newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters')
  }
  const admin = await ensureAdminUser()
  if (!verifyPassword(currentPassword, admin.passwordHash)) {
    throw new Error('Current password is incorrect')
  }
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash: hashPassword(newPassword) },
  })
}
