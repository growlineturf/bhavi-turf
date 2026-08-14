'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import SignOutButton from '@/components/sign-out-button'
import {
  LayoutDashboard,
  CalendarCheck,
  DollarSign,
  Sliders,

  CreditCard,
  ExternalLink,
  Menu,
  X,
  Trophy,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Bookings', href: '/bookings', icon: CalendarCheck },
  { label: 'Slot Pricing', href: '/pricing', icon: DollarSign },
  { label: 'Branding & Hero', href: '/branding', icon: Sliders },
  { label: 'GPay & Payment', href: '/payments', icon: CreditCard },
]

const TITLES: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map((n) => [n.href, n.label])
)

export default function DashboardShell({
  children,
  userEmail,
  authDisabled = false,
}: {
  children: React.ReactNode
  userEmail: string
  authDisabled?: boolean
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'http://localhost:3000'
  const title = TITLES[pathname] ?? 'Dashboard'

  const NavLink = ({ label, href, icon: Icon }: { label: string; href: string; icon: typeof LayoutDashboard }) => (
    <Link
      href={href}
      className={`admin-nav-link${pathname === href ? ' active' : ''}`}
      onClick={() => setOpen(false)}
    >
      <Icon size={17} />
      {label}
    </Link>
  )

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${open ? ' open' : ''}`}>
        {/* Brand */}
        <div className="admin-brand">
          <span className="admin-brand-mark" style={{ background: '#2563eb' }}>
            <Trophy size={16} />
          </span>
          <div>
            <div className="admin-brand-name">Turf Arena</div>
            <div className="admin-brand-sub">Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="admin-nav">
          {NAV_ITEMS.map((n) => (
            <NavLink key={n.href} {...n} />
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-foot">
          <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
            <ExternalLink size={15} /> View Live Site
          </a>
          {authDisabled ? (
            <span className="badge" style={{ justifyContent: 'center' }}>Local preview · auth off</span>
          ) : (
            <SignOutButton />
          )}
        </div>
      </aside>

      {open && <div className="admin-scrim" onClick={() => setOpen(false)} aria-hidden />}

      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              className="icon-btn"
              style={{ display: 'none' }}
              data-mobile-toggle
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="admin-crumb">
              <span>Turf Arena</span>
              <span style={{ color: 'var(--muted-2)' }}>/</span>
              <b>{title}</b>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="admin-live">
              <span className="dot" /> Live
            </span>
            <span className="admin-user-email" style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              {userEmail}
            </span>
          </div>
        </header>

        <div className="admin-page">{children}</div>
      </div>

      <style>{`@media (max-width: 860px){[data-mobile-toggle]{display:grid !important;}}`}</style>
    </div>
  )
}
