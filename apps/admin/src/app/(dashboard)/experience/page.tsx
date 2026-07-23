'use client'

import { ChipsInput, ErrorState, Field, ListEditor, LoadingState, PageHead, SaveBar, useSection } from '@/components/editor-kit'

type Experience = {
  id: string
  company: string
  role: string
  period: string
  type: 'INTERNSHIP' | 'FULL_TIME' | 'PART_TIME' | 'FREELANCE' | 'CONTRACT'
  location: string
  highlights: string[]
  tech: string[]
}

const TYPES: Experience['type'][] = ['INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'FREELANCE', 'CONTRACT']
const label = (t: string) => t.split('_').map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join('-')

const empty = (): Experience => ({ id: '', company: '', role: '', period: '', type: 'INTERNSHIP', location: '', highlights: [], tech: [] })

export default function ExperiencePage() {
  const { data, setData, loading, saving, status, error, save, reload } = useSection<Experience[]>('experience')

  return (
    <div>
      <PageHead title="Experience" sub="Roles shown in the experience timeline." />

      {loading ? (
        <LoadingState rows={4} />
      ) : !data ? (
        <ErrorState message={error} />
      ) : (
        <>
          <div className="card">
            <ListEditor
              items={data}
              onChange={setData}
              factory={empty}
              addLabel="Add role"
              empty="No experience entries yet."
              label={(x, i) => (x.role && x.company ? `${x.role} · ${x.company}` : `Role #${i + 1}`)}
            >
              {(exp, patch) => (
                <div className="form">
                  <div className="field-row">
                    <Field label="Company">
                      <input className="input" value={exp.company} onChange={(e) => patch({ company: e.target.value })} placeholder="Company name" />
                    </Field>
                    <Field label="Role">
                      <input className="input" value={exp.role} onChange={(e) => patch({ role: e.target.value })} placeholder="Software Engineer Intern" />
                    </Field>
                    <Field label="Period">
                      <input className="input" value={exp.period} onChange={(e) => patch({ period: e.target.value })} placeholder="Jun 2024 – Aug 2024" />
                    </Field>
                    <Field label="Type">
                      <select className="select" value={exp.type} onChange={(e) => patch({ type: e.target.value as Experience['type'] })}>
                        {TYPES.map((t) => (
                          <option key={t} value={t}>
                            {label(t)}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Location" full>
                      <input className="input" value={exp.location} onChange={(e) => patch({ location: e.target.value })} placeholder="Remote · Chennai, India" />
                    </Field>
                  </div>
                  <Field label="Highlights" hint="Bullet points describing your impact.">
                    <ChipsInput values={exp.highlights} onChange={(v) => patch({ highlights: v })} placeholder="Add a highlight…" />
                  </Field>
                  <Field label="Tech used">
                    <ChipsInput values={exp.tech} onChange={(v) => patch({ tech: v })} placeholder="React, Node…" />
                  </Field>
                </div>
              )}
            </ListEditor>
          </div>

          <SaveBar saving={saving} status={status} error={error} onSave={() => save(data)} onReset={reload} />
        </>
      )}
    </div>
  )
}
