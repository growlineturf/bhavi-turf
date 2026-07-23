'use client'

import { ErrorState, Field, ListEditor, LoadingState, PageHead, SaveBar, useSection } from '@/components/editor-kit'

type Activity = {
  id: string
  title: string
  description: string
  type: 'HACKATHON' | 'AWARD' | 'PUBLICATION' | 'VOLUNTEER' | 'ACTIVITY' | 'OTHER'
  year: string
}

const TYPES: Activity['type'][] = ['HACKATHON', 'AWARD', 'PUBLICATION', 'VOLUNTEER', 'ACTIVITY', 'OTHER']
const empty = (): Activity => ({ id: '', title: '', description: '', type: 'ACTIVITY', year: '' })

export default function ActivitiesPage() {
  const { data, setData, loading, saving, status, error, save, reload } = useSection<Activity[]>('activities')

  return (
    <div>
      <PageHead title="Activities & achievements" sub="Hackathons, awards, publications and volunteering." />

      {loading ? (
        <LoadingState rows={3} />
      ) : !data ? (
        <ErrorState message={error} />
      ) : (
        <>
          <div className="card">
            <ListEditor
              items={data}
              onChange={setData}
              factory={empty}
              addLabel="Add activity"
              empty="No activities yet."
              label={(a, i) => a.title || `Activity #${i + 1}`}
            >
              {(activity, patch) => (
                <div className="form">
                  <div className="field-row">
                    <Field label="Title">
                      <input className="input" value={activity.title} onChange={(e) => patch({ title: e.target.value })} placeholder="Winner — Smart India Hackathon" />
                    </Field>
                    <Field label="Type">
                      <select className="select" value={activity.type} onChange={(e) => patch({ type: e.target.value as Activity['type'] })}>
                        {TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t.charAt(0) + t.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Year">
                      <input className="input" value={activity.year} onChange={(e) => patch({ year: e.target.value })} placeholder="2024" />
                    </Field>
                  </div>
                  <Field label="Description">
                    <textarea className="textarea" rows={3} value={activity.description} onChange={(e) => patch({ description: e.target.value })} />
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
