import Link from 'next/link'
import { ArrowUpRight, Award, Boxes, Briefcase, FileText, FolderGit2, GraduationCap, Mail, User, Wrench } from 'lucide-react'
import { getAdminPortfolio, getContactSubmissions } from '@portfolio/cms'

export const dynamic = 'force-dynamic'

export default async function DashboardHome() {
  let data: Awaited<ReturnType<typeof getAdminPortfolio>> | null = null
  let unread = 0
  let dbError = false

  try {
    data = await getAdminPortfolio()
    const messages = await getContactSubmissions()
    unread = messages.filter((m) => !m.isRead).length
  } catch {
    dbError = true
  }

  if (dbError || !data) {
    return (
      <div>
        <div className="page-head">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Welcome back.</p>
        </div>
        <div className="empty" style={{ color: 'var(--danger)', borderColor: '#e2b4b0' }}>
          Couldn&apos;t reach the database. Make sure <code>DATABASE_URL</code> is set and the schema is migrated &amp; seeded.
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Projects', value: data.projects.length, href: '/projects' },
    { label: 'Skills', value: data.skills.length, href: '/skills' },
    { label: 'Experience', value: data.experience.length, href: '/experience' },
    { label: 'Certifications', value: data.certifications.length, href: '/certifications' },
    { label: 'Education', value: data.education.length, href: '/education' },
    { label: 'Activities', value: data.activities.length, href: '/activities' },
  ]

  const quick = [
    { label: 'Edit profile', href: '/profile', icon: User },
    { label: 'Manage projects', href: '/projects', icon: FolderGit2 },
    { label: 'Update skills', href: '/skills', icon: Wrench },
    { label: 'Experience', href: '/experience', icon: Briefcase },
    { label: 'Education', href: '/education', icon: GraduationCap },
    { label: 'Certifications', href: '/certifications', icon: Award },
    { label: 'Tech stack', href: '/tech-stack', icon: Boxes },
    { label: 'Résumé', href: '/resume', icon: FileText },
    { label: `Messages${unread ? ` · ${unread} new` : ''}`, href: '/messages', icon: Mail },
  ]

  return (
    <div className="stack" style={{ gap: 28 }}>
      <div className="page-head" style={{ margin: 0 }}>
        <h1 className="page-title">Welcome back, {data.profile.name.split(' ')[0] || 'there'}</h1>
        <p className="page-sub">Everything here publishes straight to your live portfolio.</p>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="stat-card" style={{ display: 'block' }}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </Link>
        ))}
      </div>

      <div>
        <div className="card-head" style={{ marginBottom: 14 }}>
          <h2 className="card-title">Quick actions</h2>
        </div>
        <div className="quick-grid">
          {quick.map((q) => (
            <Link key={q.href} href={q.href} className="quick-card">
              <span className="quick-ico">
                <q.icon size={18} />
              </span>
              <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{q.label}</span>
              <ArrowUpRight size={16} className="muted" style={{ marginLeft: 'auto' }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
