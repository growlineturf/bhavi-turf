import { z } from 'zod'

/**
 * Image references may be a full http(s) URL OR a root-relative public path
 * (e.g. "/eleviq-cover.png"), since assets live in each app's /public folder.
 */
const isUrlOrPath = (v: string) => v === '' || /^https?:\/\//i.test(v) || v.startsWith('/')
const imageRef = z
  .string()
  .trim()
  .refine(isUrlOrPath, 'Must be a URL or a root-relative path starting with "/"')
  .optional()
  .default('')
const imageRefItem = z
  .string()
  .trim()
  .min(1)
  .refine((v) => /^https?:\/\//i.test(v) || v.startsWith('/'), 'Must be a URL or a path starting with "/"')

export const profileSchema = z.object({
  name: z.string().min(2).max(120),
  title: z.string().min(2).max(160),
  tagline: z.string().min(2).max(220),
  summary: z.string().min(10).max(2000),
  avatarUrl: imageRef,
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
  role: z.string().max(400).optional().default(''),
  problem: z.string().max(500).optional().default(''),
  solution: z.string().max(500).optional().default(''),
  outcome: z.string().max(500).optional().default(''),
  description: z.string().max(6000).optional().default(''),
  thumbnailUrl: imageRef,
  imageUrls: z.array(imageRefItem).default([]),
  techStack: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string().min(1)).default([]),
  metricHighlights: z.array(z.string().min(1).max(240)).default([]),
  status: z.enum(['COMPLETED', 'IN_PROGRESS', 'ARCHIVED']).default('COMPLETED'),
  year: z.string().max(20).optional().default(''),
  githubUrl: z.string().url().optional().or(z.literal('')).default(''),
  liveUrl: z.string().url().optional().or(z.literal('')).default(''),
  playStoreUrl: z.string().url().optional().or(z.literal('')).default(''),
  platforms: z.array(z.string().min(1)).default([]),
  timeline: z
    .array(
      z.object({
        phase: z.string().min(1).max(120),
        period: z.string().max(80).optional().default(''),
        detail: z.string().max(400).optional().default(''),
      })
    )
    .default([]),
  team: z
    .array(
      z.object({
        name: z.string().min(1).max(120),
        role: z.string().max(160).optional().default(''),
      })
    )
    .default([]),
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
  imageUrl: imageRef,
})

export const educationSchema = z.object({
  id: z.string().optional().default(''),
  institution: z.string().min(1).max(200),
  degree: z.string().min(1).max(200),
  field: z.string().max(200).optional().default(''),
  grade: z.string().max(80).optional().default(''),
  location: z.string().max(160).optional().default(''),
  startYear: z.string().max(10).optional().default(''),
  endYear: z.string().max(10).optional().default(''),
})

export const activitySchema = z.object({
  id: z.string().optional().default(''),
  title: z.string().min(1).max(200),
  description: z.string().max(600).optional().default(''),
  type: z.enum(['HACKATHON', 'AWARD', 'PUBLICATION', 'VOLUNTEER', 'ACTIVITY', 'OTHER']).default('ACTIVITY'),
  year: z.string().max(10).optional().default(''),
})

export const techStackSchema = z.object({
  id: z.string().optional().default(''),
  name: z.string().min(1).max(80),
  iconSlug: z.string().max(80).optional().default(''),
})

export const settingsSchema = z.object({
  openToWork: z.boolean().default(true),
  availabilityText: z.string().max(180).optional().default(''),
  contactFormEnabled: z.boolean().default(true),
  chatbotEnabled: z.boolean().default(true),
  chatbotName: z.string().max(120).optional().default(''),
  chatbotGreeting: z.string().max(400).optional().default(''),
})

export const portfolioUpdateSchema = z.object({
  profile: profileSchema.optional(),
  projects: z.array(projectSchema).optional(),
  skills: z.array(skillSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  activities: z.array(activitySchema).optional(),
  techStack: z.array(techStackSchema).optional(),
  settings: settingsSchema.optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type SkillInput = z.infer<typeof skillSchema>
export type ExperienceInput = z.infer<typeof experienceSchema>
export type EducationInput = z.infer<typeof educationSchema>
export type CertificationInput = z.infer<typeof certificationSchema>
export type ActivityInput = z.infer<typeof activitySchema>
export type TechStackInput = z.infer<typeof techStackSchema>
export type SettingsInput = z.infer<typeof settingsSchema>
