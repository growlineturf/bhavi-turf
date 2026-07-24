'use client'

import { ErrorState, Field, LoadingState, PageHead, SaveBar, Toggle, useSection } from '@/components/editor-kit'

type Settings = {
  openToWork: boolean
  availabilityText: string
  contactFormEnabled: boolean
  chatbotEnabled: boolean
  chatbotName: string
  chatbotGreeting: string
}

export default function SettingsPage() {
  const { data, setData, loading, saving, status, error, save, reload } = useSection<Settings>('settings')

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setData((f) => (f ? { ...f, [key]: value } : f))

  return (
    <div>
      <PageHead title="Site settings" sub="Availability banner and contact form." />

      {loading ? (
        <LoadingState rows={5} />
      ) : !data ? (
        <ErrorState message={error} />
      ) : (
        <>
          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Availability</h2>
            </div>
            <div className="form">
              <Toggle checked={data.openToWork} onChange={(v) => set('openToWork', v)} label="Open to work" hint="Shows the availability badge on the hero." />
              <Field label="Availability text">
                <input className="input" value={data.availabilityText} onChange={(e) => set('availabilityText', e.target.value)} placeholder="Open to full-time roles from 2026" />
              </Field>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Contact form</h2>
            </div>
            <div className="form">
              <Toggle checked={data.contactFormEnabled} onChange={(v) => set('contactFormEnabled', v)} label="Enable contact form" hint="Visitors can send you messages, collected in the Messages inbox." />
            </div>
          </div>

          <SaveBar saving={saving} status={status} error={error} onSave={() => save(data)} onReset={reload} />
        </>
      )}
    </div>
  )
}
