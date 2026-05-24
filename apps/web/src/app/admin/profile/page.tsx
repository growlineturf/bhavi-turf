'use client'
import { useState, useEffect } from 'react'

type Profile = {
  name:string; title:string; tagline:string; summary:string
  email:string; phone:string; location:string
  linkedin:string; github:string; openToWork:boolean
}

export default function ProfileAdmin() {
  const [form, setForm]     = useState<Profile|null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]  = useState(false)
  const [status, setStatus]  = useState<'idle'|'success'|'error'>('idle')

  useEffect(() => {
    fetch('/api/admin/portfolio/profile').then(r=>r.json())
      .then(d => { if(d.success) setForm(d.data) })
      .finally(() => setLoading(false))
  }, [])

  const set = (field: keyof Profile, value: string | boolean) =>
    setForm(f => f ? { ...f, [field]: value } : f)

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); if(!form) return
    setSaving(true); setStatus('idle')
    const d = await fetch('/api/admin/portfolio/profile', {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form),
    }).then(r=>r.json())
    setSaving(false)
    setStatus(d.success ? 'success' : 'error')
    setTimeout(() => setStatus('idle'), 3500)
  }

  const Field = ({
    label, field, type='text', half=false, ta=false, ph='',
  }: { label:string; field:keyof Profile; type?:string; half?:boolean; ta?:boolean; ph?:string }) => (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
      <label className="a-label">{label}</label>
      {ta ? (
        <textarea
          value={String(form![field])}
          onChange={e => set(field, e.target.value)}
          rows={4} placeholder={ph}
          className="a-input a-textarea"
        />
      ) : (
        <input
          type={type}
          value={String(form![field])}
          onChange={e => set(field, e.target.value)}
          placeholder={ph}
          className="a-input"
        />
      )}
    </div>
  )

  if (loading) return (
    <div>
      <div className="admin-page-header">
        <div className="a-skeleton" style={{ height:32, width:160, marginBottom:8 }} />
        <div className="a-skeleton" style={{ height:18, width:320 }} />
      </div>
      <div className="a-card" style={{ padding:'2rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
          {[...Array(8)].map((_,i)=>(
            <div key={i} style={{ gridColumn: i > 5 ? 'span 2' : 'span 1' }}>
              <div className="a-skeleton" style={{ height:14, width:80, marginBottom:8 }} />
              <div className="a-skeleton" style={{ height:44 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (!form) return <div style={{ color:'var(--a-error)', padding:'2rem' }}>Failed to load profile data.</div>

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Edit Profile</h1>
        <p className="admin-page-sub">Changes are saved to the live portfolio immediately upon saving.</p>
      </div>

      {status === 'success' && <div className="a-toast a-toast-success">✓ Profile saved — changes are live on your portfolio!</div>}
      {status === 'error'   && <div className="a-toast a-toast-error">✗ Save failed. Check your connection and try again.</div>}

      <form onSubmit={save}>
        {/* Personal info */}
        <div className="a-card" style={{ marginBottom:'1.25rem' }}>
          <div style={{ padding:'1.1rem 1.5rem', borderBottom:'1px solid var(--a-border)' }}>
            <div className="a-section-title">Personal Information</div>
          </div>
          <div style={{ padding:'1.5rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
            <Field label="Full Name" field="name" half ph="Your full name" />
            <Field label="Job Title" field="title" half ph="e.g. AI & Full-Stack Developer" />
            <Field label="Tagline" field="tagline" ph="Your short headline" />
            <Field label="Professional Summary" field="summary" ta ph="Write 2-3 sentences about yourself..." />
          </div>
        </div>

        {/* Contact */}
        <div className="a-card" style={{ marginBottom:'1.25rem' }}>
          <div style={{ padding:'1.1rem 1.5rem', borderBottom:'1px solid var(--a-border)' }}>
            <div className="a-section-title">Contact & Socials</div>
          </div>
          <div style={{ padding:'1.5rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
            <Field label="Email" field="email" type="email" half ph="your@email.com" />
            <Field label="Phone" field="phone" half ph="+91 XXXXX XXXXX" />
            <Field label="Location" field="location" half ph="City, Country" />
            <Field label="LinkedIn URL" field="linkedin" half ph="https://linkedin.com/in/username" />
            <Field label="GitHub URL" field="github" ph="https://github.com/username" />
          </div>
        </div>

        {/* Status */}
        <div className="a-card" style={{ marginBottom:'1.5rem' }}>
          <div style={{ padding:'1.1rem 1.5rem', borderBottom:'1px solid var(--a-border)' }}>
            <div className="a-section-title">Availability</div>
          </div>
          <div style={{ padding:'1.25rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem' }}>
            <label style={{ display:'flex', alignItems:'center', gap:'0.75rem', cursor:'pointer' }}>
              <input
                type="checkbox"
                checked={form.openToWork}
                onChange={() => set('openToWork', !form.openToWork)}
                className="a-checkbox"
              />
              <div>
                <div style={{ color:'var(--a-text-1)', fontSize:'0.9rem', fontWeight:600 }}>Open to Work</div>
                <div style={{ color:'var(--a-text-2)', fontSize:'0.78rem', marginTop:'0.15rem' }}>
                  Shows the &quot;Open to work&quot; banner on your portfolio hero section
                </div>
              </div>
            </label>
            {form.openToWork && (
              <span className="a-tag a-tag-green" style={{ marginLeft:'auto' }}>✓ Active</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:'0.875rem', alignItems:'center' }}>
          <button type="submit" disabled={saving} className="a-btn a-btn-gold">
            {saving ? '⟳ Saving…' : '✓ Save Changes'}
          </button>
          <button type="button" onClick={() => window.location.reload()} className="a-btn a-btn-ghost">
            Reset
          </button>
          {status === 'success' && (
            <span style={{ fontSize:'0.82rem', color:'var(--a-success)', display:'flex', alignItems:'center', gap:'0.4rem' }}>
              ✓ Live on portfolio
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
