export type Profile = {
  name: string
  title: string
  tagline: string
  summary?: string
  avatarUrl?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  openToWork?: boolean
  availabilityText?: string
  resumeUrl?: string
}

export type Project = {
  id?: string
  title: string
  role?: string
  problem?: string
  solution?: string
  outcome?: string
  description?: string
  thumbnailUrl?: string
  imageUrls?: string[]
  techStack: string[]
  tags: string[]
  metricHighlights?: string[]
  status?: 'COMPLETED' | 'IN_PROGRESS' | 'ARCHIVED'
  year?: string
  githubUrl?: string
  liveUrl?: string
  playStoreUrl?: string
  platforms?: string[]
  timeline?: { phase: string; period?: string; detail?: string }[]
  team?: { name: string; role?: string }[]
  featured?: boolean
}

export type Skill = {
  id?: string
  name: string
  category: 'LANGUAGE' | 'FRAMEWORK' | 'DATABASE' | 'CLOUD' | 'TOOL' | 'OTHER'
  proficiency: number
  iconSlug?: string
}

export type ExperienceItem = {
  id?: string
  company: string
  role: string
  period?: string
  type?: string
  location?: string
  highlights: string[]
  tech?: string[]
}

export type EducationItem = {
  id?: string
  institution: string
  degree: string
  field: string
  grade?: string
  location?: string
  period?: string
}

export type Certification = {
  id?: string
  name: string
  issuer: string
  date?: string
  credentialUrl?: string
  imageUrl?: string
}

export type Activity = {
  id?: string
  title: string
  description?: string
  type?: string
  year?: number | null
}

export type TechStackItem = {
  id?: string
  name: string
  iconSlug?: string
}
