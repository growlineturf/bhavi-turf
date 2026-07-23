'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type PortfolioData = {
  profile: { name:string; title:string; email:string; phone:string; location:string; openToWork:boolean; linkedin:string; github:string }
  projects: { id:string; title:string; tags:string[]; featured:boolean }[]
  skills: unknown[]
  experience: unknown[]
  certifications: unknown[]
}

const STATS = [
  { key:'projects' as const, label:'Projects', icon:'🏗️', href:'/projects', color:'#C2A878' },
  { key:'skills' as const, label:'Skills', icon:'🛠️', href:'/skills', color:'#818CF8' },
  { key:'experience' as const, label:'Experience', icon:'💼', href:'/experience', color:'#34D399' },
  { key:'certifications' as const, label:'Certifications', icon:'🏅', href:'/certifications', color:'#F472B6' },
]

const QUICK = [
  { label:'Edit Profile', href:'/profile', icon:'✏️' },
  { label:'Add Project', href:'/projects', icon:'➕' },
  { label:'Add Skill', href:'/skills', icon:'🛠️' },
  { label:'View Live Site', href:process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'http://localhost:3000', icon:'↗', external: true },
]

export default function AdminDashboard() {
  const [data, setData] = useState<PortfolioData|null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio').then(r=>r.json())
      .then(d => { if(d.success) setData(d.data) })
      .finally(() => setLoading(false))
  }, [])

  const p = data?.profile
  const firstName = p?.name?.split(' ')[0] ?? 'Admin'

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
          <div>
            <h1 className="admin-page-title">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {loading ? '…' : firstName} 👋
            </h1>
            <p className="admin-page-sub">Here&apos;s what&apos;s happening with your portfolio today.</p>
          </div>
          <Link href={process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'http://localhost:3000'} target="_blank" className="a-btn a-btn-outline-gold">
            <span>↗</span> View Live Portfolio
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {STATS.map(s => (
          <Link key={s.key} href={s.href}
            className="a-card a-card-hover admin-stat"
            style={{ textDecoration:'none', display:'block' }}>
            <div className="admin-stat-icon">{s.icon}</div>
            <div className="admin-stat-value" style={{ color: s.color }}>
              {loading ? <span className="a-skeleton" style={{ width:40, height:36, display:'inline-block' }} /> : (data?.[s.key] as unknown[])?.length ?? 0}
            </div>
            <div className="admin-stat-label">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* 2-col grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', marginBottom:'1.25rem' }}>

        {/* Profile snapshot */}
        <div className="a-card">
          <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid var(--a-border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontWeight:700, color:'var(--a-text-1)', fontSize:'0.92rem' }}>Profile Snapshot</div>
            <Link href="/profile" className="a-btn a-btn-outline-gold a-btn-xs">Edit →</Link>
          </div>
          <div style={{ padding:'0.5rem 0' }}>
            {loading ? (
              <div style={{ padding:'1rem 1.5rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {[...Array(5)].map((_,i)=><div key={i} className="a-skeleton" style={{ height:28, borderRadius:6 }} />)}
              </div>
            ) : p ? (
              <>
                {[
                  ['Name', p.name],
                  ['Title', p.title],
                  ['Email', p.email],
                  ['Phone', p.phone],
                  ['Location', p.location],
                ].map(([k,v]) => (
                  <div key={k} className="a-list-item" style={{ padding:'0.75rem 1.5rem' }}>
                    <span style={{ fontSize:'0.78rem', color:'var(--a-text-2)', width:72, flexShrink:0 }}>{k}</span>
                    <span style={{ fontSize:'0.85rem', color:'var(--a-text-1)', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v}</span>
                  </div>
                ))}
                <div style={{ padding:'0.75rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:'0.78rem', color:'var(--a-text-2)' }}>Status</span>
                  <span className={`a-tag ${p.openToWork ? 'a-tag-green' : 'a-tag-gold'}`}>
                    {p.openToWork ? '✓ Open to Work' : '⏸ Not Available'}
                  </span>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Projects */}
        <div className="a-card">
          <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid var(--a-border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontWeight:700, color:'var(--a-text-1)', fontSize:'0.92rem' }}>Recent Projects</div>
            <Link href="/projects" className="a-btn a-btn-outline-gold a-btn-xs">Manage →</Link>
          </div>
          {loading ? (
            <div style={{ padding:'1rem 1.5rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {[...Array(2)].map((_,i)=><div key={i} className="a-skeleton" style={{ height:60, borderRadius:8 }} />)}
            </div>
          ) : data?.projects.length ? (
            <div style={{ padding:'0.5rem 0' }}>
              {data.projects.map(p => (
                <div key={p.id} className="a-list-item" style={{ padding:'0.85rem 1.5rem', flexDirection:'column', alignItems:'flex-start', gap:'0.4rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', width:'100%' }}>
                    <span style={{ fontWeight:600, color:'var(--a-text-1)', fontSize:'0.88rem', flex:1 }}>{p.title}</span>
                    {p.featured && <span className="a-tag a-tag-gold">★ Featured</span>}
                  </div>
                  <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap' }}>
                    {p.tags.map(t=><span key={t} className="a-tag a-tag-blue">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="a-empty">
              <div className="a-empty-icon">🏗️</div>
              <div className="a-empty-text">No projects yet</div>
              <Link href="/projects" className="a-btn a-btn-outline-gold a-btn-sm" style={{ marginTop:'0.75rem' }}>+ Add Project</Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="a-card a-card-gold">
        <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid var(--a-border)' }}>
          <div style={{ fontWeight:700, color:'var(--a-text-1)', fontSize:'0.92rem' }}>Quick Actions</div>
        </div>
        <div style={{ padding:'1rem 1.25rem', display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
          {QUICK.map(q => (
            <Link key={q.href} href={q.href} target={q.external ? '_blank' : undefined}
              className="a-btn a-btn-ghost"
              style={{ fontSize:'0.82rem' }}>
              <span>{q.icon}</span> {q.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
