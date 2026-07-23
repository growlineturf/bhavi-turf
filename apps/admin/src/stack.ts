import 'server-only'
import { StackServerApp } from '@stackframe/stack'

/**
 * Local-dev escape hatch. When the Neon Auth (Stack Auth) env is absent in a
 * NON-production environment, the admin runs without authentication so it can be
 * previewed against a local database. In production the env is required —
 * `StackServerApp` throws at construction if it's missing — so this never
 * weakens the deployed site.
 */
export const AUTH_DISABLED =
  process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_STACK_PROJECT_ID

/**
 * Neon Auth (Stack Auth) server app, or `null` when auth is disabled for local
 * dev. Reads NEXT_PUBLIC_STACK_PROJECT_ID, NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
 * and STACK_SECRET_SERVER_KEY from the environment.
 */
export const stackServerApp = AUTH_DISABLED
  ? null
  : new StackServerApp({
      tokenStore: 'nextjs-cookie',
      urls: {
        signIn: '/handler/sign-in',
        afterSignIn: '/',
        afterSignUp: '/',
        afterSignOut: '/handler/sign-in',
      },
    })

/**
 * Allowlist — the admin only opens for these emails, even though Neon Auth
 * itself may allow anyone to sign in. Configure with ADMIN_EMAILS (comma-separated).
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
