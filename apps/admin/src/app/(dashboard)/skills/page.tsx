'use client'

import { ErrorState, Field, ListEditor, LoadingState, PageHead, SaveBar, useSection } from '@/components/editor-kit'

type Skill = {
  id: string
  name: string
  category: 'LANGUAGE' | 'FRAMEWORK' | 'DATABASE' | 'CLOUD' | 'TOOL' | 'OTHER'
  proficiency: number
  iconSlug: string
}

const CATEGORIES: Skill['category'][] = ['LANGUAGE', 'FRAMEWORK', 'DATABASE', 'CLOUD', 'TOOL', 'OTHER']

const empty = (): Skill => ({ id: '', name: '', category: 'LANGUAGE', proficiency: 80, iconSlug: '' })

export default function SkillsPage() {
  const { data, setData, loading, saving, status, error, save, reload } = useSection<Skill[]>('skills')

  return (
    <div>
      <PageHead title="Skills" sub="The toolbox grid with proficiency bars. Icons use simple-icons slugs (e.g. “react”, “typescript”)." />

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
              addLabel="Add skill"
              empty="No skills yet."
              label={(s, i) => s.name || `Skill #${i + 1}`}
            >
              {(skill, patch) => (
                <div className="form">
                  <div className="field-row">
                    <Field label="Name">
                      <input className="input" value={skill.name} onChange={(e) => patch({ name: e.target.value })} placeholder="TypeScript" />
                    </Field>
                    <Field label="Category">
                      <select className="select" value={skill.category} onChange={(e) => patch({ category: e.target.value as Skill['category'] })}>
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c.charAt(0) + c.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Icon slug" hint="simple-icons slug, lowercase.">
                      <input className="input" value={skill.iconSlug} onChange={(e) => patch({ iconSlug: e.target.value })} placeholder="typescript" />
                    </Field>
                    <Field label={`Proficiency — ${skill.proficiency}%`}>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={skill.proficiency}
                        onChange={(e) => patch({ proficiency: Number(e.target.value) })}
                        style={{ width: '100%', accentColor: 'var(--ink)' }}
                      />
                    </Field>
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
