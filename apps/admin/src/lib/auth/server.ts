import 'server-only'
import { createNeonAuth } from '@neondatabase/auth/next/server'

/**
 * Local-dev escape hatch. When the Neon Auth env is absent in a NON-production
 * environment, the admin runs without authentication so it can be previewed
 * against a local database. In production the env is required, so this never
 * weakens the deployed site.
 */
export const AUTH_DISABLED = process.env.NODE_ENV !== 'production' && !process.env.NEON_AUTH_BASE_URL

/**
 * Neon Auth (Managed Better Auth) server instance, or `null` when auth is
 * disabled for local dev. Provides `.handler()`, `.middleware()`,
 * `.getSession()`, `.signIn`, `.signUp`, `.signOut`, etc.
 */
export const auth = AUTH_DISABLED
  ? null
  : createNeonAuth({
      baseUrl: process.env.NEON_AUTH_BASE_URL!,
      cookies: {
        secret: process.env.NEON_AUTH_COOKIE_SECRET!,
      },
    })

/**
 * Allowlist — only these emails may access the admin, even though Neon Auth
 * itself may allow anyone to sign up. Configure with ADMIN_EMAILS (comma-separated).
 */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'abarnasivakumar15@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export function isAllowedAdmin(email?: string | null): boolean {
  if (!email) return false
  if (ADMIN_EMAILS.length === 0) return true
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
