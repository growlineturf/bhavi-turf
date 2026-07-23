import 'server-only'
import { StackServerApp } from '@stackframe/stack'

/**
 * Neon Auth (Stack Auth) server app.
 * Reads NEXT_PUBLIC_STACK_PROJECT_ID, NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
 * and STACK_SECRET_SERVER_KEY from the environment.
 */
export const stackServerApp = new StackServerApp({
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
