'use client'

import { ErrorState, Field, ListEditor, LoadingState, PageHead, SaveBar, useSection } from '@/components/editor-kit'
import { FileUpload } from '@/components/file-upload'

type Certification = {
  id: string
  name: string
  issuer: string
  date: string
  credentialUrl: string
  imageUrl: string
}

const empty = (): Certification => ({ id: '', name: '', issuer: '', date: '', credentialUrl: '', imageUrl: '' })

export default function CertificationsPage() {
  const { data, setData, loading, saving, status, error, save, reload } = useSection<Certification[]>('certifications')

  return (
    <div>
      <PageHead title="Certifications" sub="Credentials shown in the certifications strip." />

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
              addLabel="Add certification"
              empty="No certifications yet."
              label={(c, i) => c.name || `Certification #${i + 1}`}
            >
              {(cert, patch) => (
                <div className="form">
                  <div className="field-row">
                    <Field label="Name">
                      <input className="input" value={cert.name} onChange={(e) => patch({ name: e.target.value })} placeholder="AWS Certified Cloud Practitioner" />
                    </Field>
                    <Field label="Issuer">
                      <input className="input" value={cert.issuer} onChange={(e) => patch({ issuer: e.target.value })} placeholder="Amazon Web Services" />
                    </Field>
                    <Field label="Date">
                      <input className="input" value={cert.date} onChange={(e) => patch({ date: e.target.value })} placeholder="Mar 2025" />
                    </Field>
                    <Field label="Badge image">
                      <FileUpload value={cert.imageUrl} onChange={(v) => patch({ imageUrl: v })} accept="image/*" kind="image" />
                    </Field>
                    <Field label="Credential URL" full>
                      <input className="input" value={cert.credentialUrl} onChange={(e) => patch({ credentialUrl: e.target.value })} placeholder="https://…" />
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
