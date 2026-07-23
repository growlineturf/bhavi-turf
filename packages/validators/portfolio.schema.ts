import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().min(2).max(120),
  title: z.string().min(2).max(160),
  tagline: z.string().min(2).max(220),
  summary: z.string().min(10).max(2000),
  avatarUrl: z.string().url().optional().or(z.literal('')).default(''),
  email: z.string().email(),
  phone: z.string().max(50).optional().default(''),
  location: z.string().min(2).max(160),
  linkedin: z.string().url().optional().or(z.literal('')).default(''),
  github: z.string().url().optional().or(z.literal('')).default(''),
  openToWork: z.boolean().default(true),
  availabilityText: z.string().max(180).optional().default(''),
})

export const projectSchema = z.object({
  id: z.string().optional().default(''),
  title: z.string().min(2).max(180),
  role: z.string().max(180).optional().default(''),
  problem: z.string().max(500).optional().default(''),
  solution: z.string().max(500).optional().default(''),
  outcome: z.string().max(500).optional().default(''),
  description: z.string().max(6000).optional().default(''),
  thumbnailUrl: z.string().url().optional().or(z.literal('')).default(''),
  imageUrls: z.array(z.string().url()).default([]),
  techStack: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string().min(1)).default([]),
  metricHighlights: z.array(z.string().min(1).max(140)).default([]),
  status: z.enum(['COMPLETED', 'IN_PROGRESS', 'ARCHIVED']).default('COMPLETED'),
  year: z.string().max(20).optional().default(''),
  githubUrl: z.string().url().optional().or(z.literal('')).default(''),
  liveUrl: z.string().url().optional().or(z.literal('')).default(''),
  featured: z.boolean().default(false),
})

export const skillSchema = z.object({
  id: z.string().optional().default(''),
  name: z.string().min(1).max(80),
  category: z.enum(['LANGUAGE', 'FRAMEWORK', 'DATABASE', 'CLOUD', 'TOOL', 'OTHER']),
  proficiency: z.number().int().min(0).max(100),
  iconSlug: z.string().max(80).optional().default(''),
})

export const experienceSchema = z.object({
  id: z.string().optional().default(''),
  company: z.string().min(1).max(160),
  role: z.string().min(1).max(160),
  period: z.string().max(120).optional().default(''),
  type: z.enum(['INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'FREELANCE', 'CONTRACT']),
  location: z.string().max(160).optional().default(''),
  highlights: z.array(z.string().min(1)).default([]),
  tech: z.array(z.string().min(1)).default([]),
})

export const certificationSchema = z.object({
  id: z.string().optional().default(''),
  name: z.string().min(1).max(180),
  issuer: z.string().min(1).max(180),
  date: z.string().max(80).optional().default(''),
  credentialUrl: z.string().url().optional().or(z.literal('')).default(''),
})

export const portfolioUpdateSchema = z.object({
  profile: profileSchema.optional(),
  projects: z.array(projectSchema).optional(),
  skills: z.array(skillSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type SkillInput = z.infer<typeof skillSchema>
export type ExperienceInput = z.infer<typeof experienceSchema>
export type CertificationInput = z.infer<typeof certificationSchema>
