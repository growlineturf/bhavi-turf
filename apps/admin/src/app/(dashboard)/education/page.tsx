'use client'

import { ErrorState, Field, ListEditor, LoadingState, PageHead, SaveBar, useSection } from '@/components/editor-kit'

type Education = {
  id: string
  institution: string
  degree: string
  field: string
  grade: string
  location: string
  startYear: string
  endYear: string
}

const empty = (): Education => ({ id: '', institution: '', degree: '', field: '', grade: '', location: '', startYear: '', endYear: '' })

export default function EducationPage() {
  const { data, setData, loading, saving, status, error, save, reload } = useSection<Education[]>('education')

  return (
    <div>
      <PageHead title="Education" sub="Degrees and institutions shown in the education section." />

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
              addLabel="Add education"
              empty="No education entries yet."
              label={(x, i) => x.institution || `Entry #${i + 1}`}
            >
              {(edu, patch) => (
                <div className="form">
                  <div className="field-row">
                    <Field label="Institution">
                      <input className="input" value={edu.institution} onChange={(e) => patch({ institution: e.target.value })} placeholder="University name" />
                    </Field>
                    <Field label="Degree">
                      <input className="input" value={edu.degree} onChange={(e) => patch({ degree: e.target.value })} placeholder="B.Tech" />
                    </Field>
                    <Field label="Field of study">
                      <input className="input" value={edu.field} onChange={(e) => patch({ field: e.target.value })} placeholder="Computer Science" />
                    </Field>
                    <Field label="Grade / CGPA">
                      <input className="input" value={edu.grade} onChange={(e) => patch({ grade: e.target.value })} placeholder="9.1 CGPA" />
                    </Field>
                    <Field label="Location">
                      <input className="input" value={edu.location} onChange={(e) => patch({ location: e.target.value })} placeholder="Chennai, India" />
                    </Field>
                    <div className="field-row" style={{ gridColumn: '1 / -1' }}>
                      <Field label="Start year">
                        <input className="input" value={edu.startYear} onChange={(e) => patch({ startYear: e.target.value })} placeholder="2021" />
                      </Field>
                      <Field label="End year" hint="Leave blank if ongoing.">
                        <input className="input" value={edu.endYear} onChange={(e) => patch({ endYear: e.target.value })} placeholder="2025" />
                      </Field>
                    </div>
                  </div>
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
