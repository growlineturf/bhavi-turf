/**
 * All cache key factories — single source of truth.
 * Add new keys HERE ONLY. Never hardcode cache keys in app code.
 */
export const CacheKeys = {
  portfolio:        (slug: string) => `portfolio:${slug}:full`,
  skills:           (slug: string) => `portfolio:${slug}:skills`,
  projects:         (slug: string) => `portfolio:${slug}:projects`,
  experience:       (slug: string) => `portfolio:${slug}:experience`,
  education:        (slug: string) => `portfolio:${slug}:education`,
  certifications:   (slug: string) => `portfolio:${slug}:certifications`,
  techStack:        (slug: string) => `portfolio:${slug}:tech-stack`,
  siteSettings:     ()             => `portfolio:settings`,

  /** Invalidation groups — pass to cacheInvalidate() after mutations */
  groups: {
    allPortfolio: (slug: string): string[] => [
      `portfolio:${slug}:full`,
      `portfolio:${slug}:skills`,
      `portfolio:${slug}:projects`,
      `portfolio:${slug}:experience`,
      `portfolio:${slug}:education`,
      `portfolio:${slug}:certifications`,
      `portfolio:${slug}:tech-stack`,
    ],
  },
} as const
