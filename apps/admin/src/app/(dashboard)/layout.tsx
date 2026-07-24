import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { AUTH_DISABLED, getAuth, isAllowedAdmin } from '@/lib/auth/server'
import SignOutButton from '@/components/sign-out-button'
import DashboardShell from './DashboardShell'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Local dev without Neon Auth env → skip sign-in entirely.
  if (AUTH_DISABLED) {
    return (
      <DashboardShell userEmail="Local preview" authDisabled>
        {children}
      </DashboardShell>
    )
  }

  const auth = getAuth()!
  const { data: session } = await auth.getSession()

  // Not signed in → send to the sign-in page.
  if (!session?.user) redirect('/auth/sign-in')

  // Signed in but not on the allowlist → deny (no portfolio access).
  if (!isAllowedAdmin(session.user.email)) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <span className="auth-mark">AS</span>
          <h1>Access restricted</h1>
          <p>
            You&apos;re signed in as <b>{session.user.email}</b>, but this account isn&apos;t authorised
            to manage the portfolio.
          </p>
          <SignOutButton className="btn btn-dark" />
        </div>
      </div>
    )
  }

  return <DashboardShell userEmail={session.user.email || ''}>{children}</DashboardShell>
}
