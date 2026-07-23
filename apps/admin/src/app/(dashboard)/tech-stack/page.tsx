'use client'

import { ErrorState, Field, ListEditor, LoadingState, PageHead, SaveBar, useSection } from '@/components/editor-kit'

type TechItem = { id: string; name: string; iconSlug: string }

const empty = (): TechItem => ({ id: '', name: '', iconSlug: '' })

export default function TechStackPage() {
  const { data, setData, loading, saving, status, error, save, reload } = useSection<TechItem[]>('techStack')

  return (
    <div>
      <PageHead title="Tech stack" sub="The logo marquee. Icons use simple-icons slugs (e.g. “nextdotjs”, “postgresql”)." />

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
              addLabel="Add technology"
              empty="No technologies yet."
              label={(t, i) => t.name || `Item #${i + 1}`}
            >
              {(item, patch) => (
                <div className="field-row">
                  <Field label="Name">
                    <input className="input" value={item.name} onChange={(e) => patch({ name: e.target.value })} placeholder="Next.js" />
                  </Field>
                  <Field label="Icon slug" hint="simple-icons slug, lowercase.">
                    <input className="input" value={item.iconSlug} onChange={(e) => patch({ iconSlug: e.target.value })} placeholder="nextdotjs" />
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
