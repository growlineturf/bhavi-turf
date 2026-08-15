import type { Project } from '@/components/portfolio-types'
import {
  fallbackProfile,
  fallbackProjects,
  projectDetails,
  projectSlug,
  type ProjectDetail,
} from '@/components/data/fallback'

export async function loadProjects(): Promise<{ projects: Project[]; github: string }> {
  return { projects: fallbackProjects, github: fallbackProfile.github }
}

export async function getProject(
  slug: string,
): Promise<{ project: Project; detail?: ProjectDetail; github: string } | null> {
  const { projects, github } = await loadProjects()
  const project = projects.find((item) => projectSlug(item.title) === slug)
  if (!project) return null
  return { project, detail: projectDetails[slug], github }
}
