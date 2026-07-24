'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import SignOutButton from '@/components/sign-out-button'
import {
  Activity,
  Award,
  Boxes,
  Briefcase,
  ExternalLink,
  FileText,
  FolderGit2,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Menu,
  Settings,
  User,
  Wrench,
  X,
} from 'lucide-react'

const CONTENT = [
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Projects', href: '/projects', icon: FolderGit2 },
  { label: 'Skills', href: '/skills', icon: Wrench },
  { label: 'Experience', href: '/experience', icon: Briefcase },
  { label: 'Education', href: '/education', icon: GraduationCap },
  { label: 'Certifications', href: '/certifications', icon: Award },
  { label: 'Tech Stack', href: '/tech-stack', icon: Boxes },
  { label: 'Activities', href: '/activities', icon: Activity },
]

const SITE = [
  { label: 'Résumé', href: '/resume', icon: FileText },
  { label: 'Messages', href: '/messages', icon: Mail },
  { label: 'Settings', href: '/settings', icon: Settings },
]

const TITLES: Record<string, string> = {
  '/': 'Dashboard',
  ...Object.fromEntries([...CONTENT, ...SITE].map((n) => [n.href, n.label])),
}

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
  const title = TITLES[pathname] ?? 'Admin'

  const NavLink = ({ label, href, icon: Icon }: { label: string; href: string; icon: typeof User }) => (
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
        <div className="admin-brand">
          <span className="admin-brand-mark">AS</span>
          <div>
            <div className="admin-brand-name">Portfolio</div>
            <div className="admin-brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          <Link href="/" className={`admin-nav-link${pathname === '/' ? ' active' : ''}`} onClick={() => setOpen(false)}>
            <LayoutDashboard size={17} /> Dashboard
          </Link>

          <div className="admin-nav-label">Content</div>
          {CONTENT.map((n) => (
            <NavLink key={n.href} {...n} />
          ))}

          <div className="admin-nav-label">Site</div>
          {SITE.map((n) => (
            <NavLink key={n.href} {...n} />
          ))}
        </nav>

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
              <span>Admin</span>
              <span style={{ color: 'var(--muted-2)' }}>/</span>
              <b>{title}</b>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="admin-live">
              <span className="dot" /> Live
            </span>
            <span className="admin-user-email" style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{userEmail}</span>
          </div>
        </header>

        <div className="admin-page">{children}</div>
      </div>

      <style>{`@media (max-width: 860px){[data-mobile-toggle]{display:grid !important;}}`}</style>
    </div>
  )
}
