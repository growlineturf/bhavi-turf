'use client'

import { useState } from 'react'
import { useAdmin } from '@/lib/adminStore'
import { Save, Sliders } from 'lucide-react'

export default function BrandingPage() {
  const { config, updateConfig } = useAdmin()
  const [form, setForm] = useState({
    turfName: config.turfName,
    city: config.city,
    heroTitle: config.heroTitle,
    heroTagline: config.heroTagline,
    heroBannerUrl: config.heroBannerUrl,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateConfig(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const Field = ({
    label, field, placeholder, multiline = false
  }: {
    label: string
    field: keyof typeof form
    placeholder: string
    multiline?: boolean
  }) => (
    <div className="field">
      <label className="field-label">{label}</label>
      {multiline ? (
        <textarea
          rows={2}
          value={form[field]}
          placeholder={placeholder}
          onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
          style={{ width: '100%', padding: '9px 13px', borderRadius: 10, border: '1.5px solid var(--line)', background: 'var(--surface-2)', color: 'var(--fg)', fontSize: '0.9rem', resize: 'vertical', outline: 'none' }}
        />
      ) : (
        <input
          type="text"
          value={form[field]}
          placeholder={placeholder}
          onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
          className="field-input"
        />
      )}
    </div>
  )

  return (
    <div className="stack" style={{ gap: 28 }}>
      <div className="page-head" style={{ margin: 0 }}>
        <h1 className="page-title">Branding & Hero</h1>
        <p className="page-sub">Update turf name, city, and homepage hero content.</p>
      </div>

      <form onSubmit={handleSave} className="stack" style={{ gap: 20, maxWidth: 560 }}>
        <div className="card">
          <div className="card-head"><h2 className="card-title"><Sliders size={15} /> Turf Identity</h2></div>
          <div className="stack" style={{ gap: 16, marginTop: 18 }}>
            <Field label="Turf Name" field="turfName" placeholder="e.g. Green Warriors Turf" />
            <Field label="City / Location" field="city" placeholder="e.g. Coimbatore, Tamil Nadu" />
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h2 className="card-title">Hero Section (Homepage)</h2></div>
          <div className="stack" style={{ gap: 16, marginTop: 18 }}>
            <Field label="Hero Title" field="heroTitle" placeholder="e.g. Play at the Best Turf in Town" />
            <Field label="Hero Tagline" field="heroTagline" placeholder="e.g. Book your slot in 30 seconds" multiline />
            <Field label="Hero Banner Image URL" field="heroBannerUrl" placeholder="https://..." />
            {form.heroBannerUrl && (
              <img
                src={form.heroBannerUrl}
                alt="Banner preview"
                style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line)' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className="card" style={{ background: '#0a0a0a', border: '1px solid #222' }}>
          <div className="card-head"><h2 className="card-title">Live Preview</h2></div>
          <div style={{
            marginTop: 16, borderRadius: 12, overflow: 'hidden', position: 'relative',
            backgroundImage: form.heroBannerUrl ? `url(${form.heroBannerUrl})` : 'linear-gradient(135deg,#1e3a5f,#0a0a0a)',
            backgroundSize: 'cover', backgroundPosition: 'center', padding: '32px 24px',
            minHeight: 120
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', borderRadius: 12 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ color: '#3b82f6', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                {form.city}
              </div>
              <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '1.3rem', margin: '0 0 6px' }}>{form.heroTitle || 'Hero Title'}</h3>
              <p style={{ color: '#d1d5db', fontSize: '0.85rem', margin: 0 }}>{form.heroTagline || 'Tagline here'}</p>
            </div>
          </div>
        </div>

        <button type="submit" className="btn" style={{ display: 'flex', alignItems: 'center', gap: 8, background: saved ? '#22c55e' : '' }}>
          <Save size={15} />
          {saved ? '✓ Saved!' : 'Save Branding'}
        </button>
      </form>
    </div>
  )
}
