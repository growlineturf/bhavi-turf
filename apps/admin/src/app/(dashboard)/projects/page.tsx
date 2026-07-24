'use client'

import { ChipsInput, ErrorState, Field, ListEditor, LoadingState, PageHead, SaveBar, Toggle, useSection } from '@/components/editor-kit'
import { FileUpload, FileUploadMulti } from '@/components/file-upload'

type TimelineItem = { phase: string; period: string; detail: string }
type TeamMember = { name: string; role: string }
type Project = {
  id: string
  title: string
  role: string
  description: string
  thumbnailUrl: string
  imageUrls: string[]
  techStack: string[]
  tags: string[]
  metricHighlights: string[]
  status: 'COMPLETED' | 'IN_PROGRESS' | 'ARCHIVED'
  year: string
  githubUrl: string
  liveUrl: string
  playStoreUrl: string
  platforms: string[]
  timeline: TimelineItem[]
  team: TeamMember[]
  featured: boolean
}

const empty = (): Project => ({
  id: '',
  title: '',
  role: '',
  description: '',
  thumbnailUrl: '',
  imageUrls: [],
  techStack: [],
  tags: [],
  metricHighlights: [],
  status: 'COMPLETED',
  year: '',
  githubUrl: '',
  liveUrl: '',
  playStoreUrl: '',
  platforms: [],
  timeline: [],
  team: [],
  featured: false,
})

export default function ProjectsPage() {
  const { data, setData, loading, saving, status, error, save, reload } = useSection<Project[]>('projects')

  return (
    <div>
      <PageHead title="Projects" sub="Case studies that appear in the work grid and on each project page." />

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
              addLabel="Add project"
              empty="No projects yet — add your first case study."
              label={(p, i) => p.title || `Project #${i + 1}`}
            >
              {(project, patch) => (
                <div className="form">
                  <div className="field-row">
                    <Field label="Title">
                      <input className="input" value={project.title} onChange={(e) => patch({ title: e.target.value })} placeholder="Project name" />
                    </Field>
                    <Field label="Your role">
                      <input className="input" value={project.role} onChange={(e) => patch({ role: e.target.value })} placeholder="Full-Stack Developer" />
                    </Field>
                  </div>

                  <Field label="Description" hint="Full write-up shown on the project detail page.">
                    <textarea className="textarea" rows={5} value={project.description} onChange={(e) => patch({ description: e.target.value })} />
                  </Field>

                  <div className="field-row">
                    <Field label="Status">
                      <select className="select" value={project.status} onChange={(e) => patch({ status: e.target.value as Project['status'] })}>
                        <option value="COMPLETED">Completed</option>
                        <option value="IN_PROGRESS">In progress</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </Field>
                    <Field label="Year">
                      <input className="input" value={project.year} onChange={(e) => patch({ year: e.target.value })} placeholder="2025" />
                    </Field>
                  </div>

                  <Field label="Thumbnail image" hint="Cover shown in the work grid.">
                    <FileUpload value={project.thumbnailUrl} onChange={(v) => patch({ thumbnailUrl: v })} accept="image/*" kind="image" />
                  </Field>
                  <Field label="Gallery media" hint="Images or video shown in the project's carousel.">
                    <FileUploadMulti values={project.imageUrls} onChange={(v) => patch({ imageUrls: v })} />
                  </Field>

                  <div className="field-row">
                    <Field label="GitHub URL">
                      <input className="input" value={project.githubUrl} onChange={(e) => patch({ githubUrl: e.target.value })} placeholder="https://github.com/…" />
                    </Field>
                    <Field label="Live URL">
                      <input className="input" value={project.liveUrl} onChange={(e) => patch({ liveUrl: e.target.value })} placeholder="https://…" />
                    </Field>
                    <Field label="Play Store URL">
                      <input className="input" value={project.playStoreUrl} onChange={(e) => patch({ playStoreUrl: e.target.value })} placeholder="https://play.google.com/…" />
                    </Field>
                    <Field label="Platforms" hint="Web, Android, iOS…">
                      <ChipsInput values={project.platforms} onChange={(v) => patch({ platforms: v })} placeholder="Add platform…" />
                    </Field>
                  </div>

                  <Field label="Tech stack">
                    <ChipsInput values={project.techStack} onChange={(v) => patch({ techStack: v })} placeholder="Next.js, Prisma…" />
                  </Field>
                  <Field label="Tags" hint="Short category labels for the work grid.">
                    <ChipsInput values={project.tags} onChange={(v) => patch({ tags: v })} placeholder="AI, Commerce…" />
                  </Field>
                  <Field label="Metric highlights" hint="Punchy outcomes, e.g. “40% faster checkout”.">
                    <ChipsInput values={project.metricHighlights} onChange={(v) => patch({ metricHighlights: v })} placeholder="Add a metric…" />
                  </Field>

                  <Field label="Project timeline">
                    <ListEditor
                      items={project.timeline}
                      onChange={(v) => patch({ timeline: v })}
                      factory={() => ({ phase: '', period: '', detail: '' })}
                      addLabel="Add phase"
                      empty="No timeline phases."
                      label={(t, i) => t.phase || `Phase ${i + 1}`}
                    >
                      {(t, patchT) => (
                        <div className="form">
                          <div className="field-row">
                            <Field label="Phase">
                              <input className="input" value={t.phase} onChange={(e) => patchT({ phase: e.target.value })} placeholder="Research" />
                            </Field>
                            <Field label="Period">
                              <input className="input" value={t.period} onChange={(e) => patchT({ period: e.target.value })} placeholder="Weeks 1–2" />
                            </Field>
                          </div>
                          <Field label="Detail">
                            <input className="input" value={t.detail} onChange={(e) => patchT({ detail: e.target.value })} placeholder="What happened in this phase" />
                          </Field>
                        </div>
                      )}
                    </ListEditor>
                  </Field>

                  <Field label="Team members">
                    <ListEditor
                      items={project.team}
                      onChange={(v) => patch({ team: v })}
                      factory={() => ({ name: '', role: '' })}
                      addLabel="Add member"
                      empty="Solo project."
                      label={(m, i) => m.name || `Member ${i + 1}`}
                    >
                      {(m, patchM) => (
                        <div className="field-row">
                          <Field label="Name">
                            <input className="input" value={m.name} onChange={(e) => patchM({ name: e.target.value })} placeholder="Name" />
                          </Field>
                          <Field label="Role">
                            <input className="input" value={m.role} onChange={(e) => patchM({ role: e.target.value })} placeholder="Backend" />
                          </Field>
                        </div>
                      )}
                    </ListEditor>
                  </Field>

                  <Toggle checked={project.featured} onChange={(v) => patch({ featured: v })} label="Featured project" hint="Featured projects are highlighted first in the grid." />
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
