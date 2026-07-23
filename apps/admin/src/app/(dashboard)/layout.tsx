import type { ReactNode } from 'react'
import Link from 'next/link'
import { stackServerApp, isAllowedAdmin } from '@/stack'
import DashboardShell from './DashboardShell'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Redirects to /handler/sign-in when not signed in.
  const user = await stackServerApp.getUser({ or: 'redirect' })

  // Signed in but not on the allowlist → deny (no portfolio access).
  if (!isAllowedAdmin(user.primaryEmail)) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <span className="auth-mark">AS</span>
          <h1>Access restricted</h1>
          <p>
            You&apos;re signed in as <b>{user.primaryEmail}</b>, but this account isn&apos;t authorised
            to manage the portfolio.
          </p>
          <Link href="/handler/sign-out" className="btn btn-dark" style={{ width: '100%' }}>
            Sign out
          </Link>
        </div>
      </div>
    )
  }

  return <DashboardShell userEmail={user.primaryEmail || ''}>{children}</DashboardShell>
}
