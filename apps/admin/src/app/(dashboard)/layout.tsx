'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { label: 'Dashboard',      href: '/',                icon: '◈' },
  { label: 'Profile',        href: '/profile',         icon: '◉' },
  { label: 'Projects',       href: '/projects',        icon: '◧' },
  { label: 'Skills',         href: '/skills',          icon: '◎' },
  { label: 'Experience',     href: '/experience',      icon: '◑' },
  { label: 'Certifications', href: '/certifications',  icon: '◈' },
]

const NAV_BOTTOM = [
  { label: 'Settings',       href: '/settings',       icon: '⚙' },
]

const PAGE_TITLES: Record<string, string> = {
  '/':               'Dashboard',
  '/profile':        'Edit Profile',
  '/projects':       'Projects',
  '/skills':         'Skills',
  '/experience':     'Experience',
  '/certifications': 'Certifications',
  '/settings':       'Settings',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const router    = useRouter()

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const pageTitle = PAGE_TITLES[pathname] ?? 'Admin Panel'

  return (
    <div className="admin-wrap">
      <div className="admin-shell">

        {/* ── Sidebar ─────────────────────── */}
        <aside className="admin-sidebar">

          {/* Logo */}
          <div className="admin-logo">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: 'linear-gradient(135deg, rgba(194,168,120,0.3) 0%, rgba(194,168,120,0.08) 100%)',
                border: '1px solid var(--a-border-gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 800, color: 'var(--a-gold)',
                letterSpacing: '-0.02em', flexShrink: 0,
              }}>AS</div>
              <div>
                <div className="admin-logo-mark" style={{ fontSize: '1.1rem' }}>Portfolio</div>
                <div className="admin-logo-sub">Admin Panel</div>
              </div>
            </div>
          </div>

          {/* Main Nav */}
          <nav className="admin-nav" style={{ paddingTop: '0.75rem' }}>
            <div className="admin-nav-label">Content</div>
            {NAV.map(n => (
              <Link key={n.href} href={n.href}
                className={`admin-nav-link${pathname === n.href ? ' active' : ''}`}>
                <span className="admin-nav-icon" style={{ fontSize: '0.8rem', opacity: 0.7 }}>{n.icon}</span>
                {n.label}
              </Link>
            ))}

            <div className="admin-nav-label" style={{ marginTop: '1rem' }}>Account</div>
            {NAV_BOTTOM.map(n => (
              <Link key={n.href} href={n.href}
                className={`admin-nav-link${pathname === n.href ? ' active' : ''}`}>
                <span className="admin-nav-icon" style={{ fontSize: '0.85rem' }}>{n.icon}</span>
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="admin-sidebar-foot">
            <Link href={process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'http://localhost:3000'} target="_blank" className="admin-view-btn">
              <span style={{ fontSize: '0.75rem' }}>↗</span>
              View Live Site
            </Link>
            <button onClick={logout} className="admin-logout-btn">
              <span style={{ fontSize: '0.85rem' }}>→</span>
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main ──────────────────────────── */}
        <div className="admin-main">

          {/* Topbar */}
          <header className="admin-topbar">
            <div className="admin-topbar-breadcrumb">
              <span>Admin</span>
              <span style={{ color: 'var(--a-text-3)', fontSize: '0.7rem' }}>›</span>
              <span style={{ color: 'var(--a-text-1)', fontWeight: 600 }}>{pageTitle}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.45rem',
                padding: '0.3rem 0.7rem',
                background: 'rgba(34,197,94,0.07)',
                border: '1px solid rgba(34,197,94,0.18)',
                borderRadius: '999px',
                fontSize: '0.7rem', fontWeight: 600, color: '#4ade80',
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%', background: '#22C55E',
                  display: 'inline-block', boxShadow: '0 0 6px #22C55E',
                }} />
                Live
              </div>
              <Link href="/settings" title="Settings"
                style={{
                  width: 32, height: 32, borderRadius: 8, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'transparent', border: '1px solid var(--a-border)',
                  color: 'var(--a-text-2)', textDecoration: 'none', fontSize: '0.85rem',
                  transition: 'var(--a-transition)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--a-gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--a-gold)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--a-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--a-text-2)' }}>
                ⚙
              </Link>
            </div>
          </header>

          {/* Content */}
          <div className="admin-page">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
