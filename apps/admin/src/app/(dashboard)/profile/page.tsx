'use client'

import { ErrorState, Field, LoadingState, PageHead, SaveBar, Toggle, useSection } from '@/components/editor-kit'
import { FileUpload } from '@/components/file-upload'

type Profile = {
  name: string
  title: string
  tagline: string
  summary: string
  avatarUrl: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  openToWork: boolean
  availabilityText: string
}

export default function ProfilePage() {
  const { data, setData, loading, saving, status, error, save, reload } = useSection<Profile>('profile')

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => setData((f) => (f ? { ...f, [key]: value } : f))

  return (
    <div>
      <PageHead title="Profile" sub="Your identity, contact details and availability — shown across the portfolio hero and footer." />

      {loading ? (
        <LoadingState rows={6} />
      ) : !data ? (
        <ErrorState message={error} />
      ) : (
        <>
          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Identity</h2>
            </div>
            <div className="form">
              <div className="field-row">
                <Field label="Full name">
                  <input className="input" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Abarna Sivakumar" />
                </Field>
                <Field label="Job title">
                  <input className="input" value={data.title} onChange={(e) => set('title', e.target.value)} placeholder="AI & Full-Stack Developer" />
                </Field>
              </div>
              <Field label="Tagline" hint="A short headline shown under your name in the hero.">
                <input className="input" value={data.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="Building intelligent, human-centred products" />
              </Field>
              <Field label="Summary" hint="2–3 sentences. Appears in the About section.">
                <textarea className="textarea" rows={4} value={data.summary} onChange={(e) => set('summary', e.target.value)} />
              </Field>
              <Field label="Avatar / portrait image" hint="Upload a portrait. Leave empty to use the built-in image.">
                <FileUpload value={data.avatarUrl} onChange={(v) => set('avatarUrl', v)} accept="image/*" kind="image" />
              </Field>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Contact &amp; socials</h2>
            </div>
            <div className="form">
              <div className="field-row">
                <Field label="Email">
                  <input className="input" type="email" value={data.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" />
                </Field>
                <Field label="Phone">
                  <input className="input" value={data.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 …" />
                </Field>
                <Field label="Location">
                  <input className="input" value={data.location} onChange={(e) => set('location', e.target.value)} placeholder="City, Country" />
                </Field>
                <Field label="LinkedIn URL">
                  <input className="input" value={data.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/…" />
                </Field>
                <Field label="GitHub URL" full>
                  <input className="input" value={data.github} onChange={(e) => set('github', e.target.value)} placeholder="https://github.com/…" />
                </Field>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Availability</h2>
            </div>
            <div className="form">
              <Toggle
                checked={data.openToWork}
                onChange={(v) => set('openToWork', v)}
                label="Open to work"
                hint="Shows the availability badge on your portfolio hero."
              />
              <Field label="Availability text">
                <input className="input" value={data.availabilityText} onChange={(e) => set('availabilityText', e.target.value)} placeholder="Open to full-time roles from 2026" />
              </Field>
            </div>
          </div>

          <SaveBar saving={saving} status={status} error={error} onSave={() => save(data)} onReset={reload} />
        </>
      )}
    </div>
  )
}
