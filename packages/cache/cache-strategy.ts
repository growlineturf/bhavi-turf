/**
 * TTL constants in seconds — single source of truth.
 * null = NEVER CACHE (always fetch live from DB).
 */
export const TTL = {
  // 🔴 NEVER CACHE — always live
  CHAT_SESSION:    null,
  CONTACT_FORM:    null,
  SITE_SETTINGS:   null,  // admin toggles must be instant

  // 🟠 SHORT — changes during active day
  DASHBOARD_STATS: 120,   // 2min

  // 🟡 MEDIUM — changes occasionally
  PROJECTS_LIST:   300,   // 5min
  SKILLS_LIST:     600,   // 10min
  EXPERIENCE:      600,   // 10min
  EDUCATION:       600,   // 10min
  CERTIFICATIONS:  600,   // 10min

  // 🟢 LONG — rarely changes
  PORTFOLIO_FULL:  300,   // 5min
  TECH_STACK:      3_600, // 1hr
} as const

export type TTLKey = keyof typeof TTL
