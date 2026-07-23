'use client'
import { useEffect, useState } from 'react'

type ProjectStatus = 'COMPLETED' | 'IN_PROGRESS' | 'ARCHIVED'

type Project = {
  id:string
  title:string
  role:string
  problem:string
  solution:string
  outcome:string
  description:string
  thumbnailUrl:string
  imageUrls:string[]
  techStack:string[]
  tags:string[]
  metricHighlights:string[]
  status:ProjectStatus
  year:string
  githubUrl:string
  liveUrl:string
  featured:boolean
}

const BLANK: Project = {
  id:'',
  title:'',
  role:'',
  problem:'',
  solution:'',
  outcome:'',
  description:'',
  thumbnailUrl:'',
  imageUrls:[],
  techStack:[],
  tags:[],
  metricHighlights:[],
  status:'COMPLETED',
  year:'',
  githubUrl:'',
  liveUrl:'',
  featured:false,
}

const inp: React.CSSProperties = {
  width:'100%',
  background:'rgba(255,255,255,0.03)',
  border:'1px solid rgba(255,255,255,0.06)',
  borderRadius:8,
  padding:'0.7rem 0.95rem',
  color:'#F0EEE8',
  fontSize:'0.875rem',
  fontFamily:'inherit',
  outline:'none',
  transition:'all 0.2s',
}

async function saveProjects(projects: Project[]) {
  return fetch('/api/portfolio/projects', {
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(projects),
  }).then(r=>r.json())
}

function splitList(value: string) {
  return value
    .split(/[\n,]+/)
    .map(item => item.trim())
    .filter(Boolean)
}

function joinList(value: string[]) {
  return value.join(', ')
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState<Project|null>(null)
  const [saving, setSaving]     = useState(false)
  const [status, setStatus]     = useState<'idle'|'success'|'error'>('idle')

  useEffect(() => {
    fetch('/api/portfolio/projects').then(r=>r.json())
      .then(d => { if(d.success) setProjects(d.data) })
      .finally(() => setLoading(false))
  }, [])

  const flash = (ok:boolean) => {
    setStatus(ok?'success':'error')
    setTimeout(()=>setStatus('idle'),3000)
  }

  const persist = async (updated: Project[]) => {
    setSaving(true)
    const d = await saveProjects(updated)
    setSaving(false)
    if(d.success) {
      setProjects(Array.isArray(d.data) ? d.data : updated)
      setEditing(null)
    }
    flash(d.success)
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if(!editing) return
    const updated = editing.id
      ? projects.map(p => p.id===editing.id ? editing : p)
      : [...projects, {...editing, id:Date.now().toString()}]
    persist(updated)
  }

  const del = (id:string) => {
    if(!confirm('Delete this project? This cannot be undone.')) return
    persist(projects.filter(p=>p.id!==id))
  }

  const setField = <K extends keyof Project>(field: K, value: Project[K]) => {
    setEditing(project => project ? { ...project, [field]: value } : project)
  }

  const renderTextField = ({
    label, field, rows=0, ph='', required=false,
  }: { label:string; field:keyof Project; rows?:number; ph?:string; required?:boolean }) => (
    <div>
      <label className="a-label">{label}</label>
      {rows > 0 ? (
        <textarea
          value={String(editing?.[field] ?? '')}
          rows={rows}
          placeholder={ph}
          required={required}
          onChange={e=>setField(field, e.target.value as never)}
          style={{...inp, resize:'vertical'}}
        />
      ) : (
        <input
          value={String(editing?.[field] ?? '')}
          placeholder={ph}
          required={required}
          onChange={e=>setField(field, e.target.value as never)}
          style={inp}
        />
      )}
    </div>
  )

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem' }}>
          <div>
            <h1 className="admin-page-title">Projects</h1>
            <p className="admin-page-sub">Add recruiter-ready case studies. Changes go live immediately.</p>
          </div>
          <button onClick={()=>setEditing(BLANK)} className="a-btn a-btn-gold">
            + Add Project
          </button>
        </div>
      </div>

      {status==='success' && <div className="a-toast a-toast-success">✓ Projects saved to portfolio!</div>}
      {status==='error'   && <div className="a-toast a-toast-error">✗ Save failed. Try again.</div>}

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
          {[...Array(2)].map((_,i)=><div key={i} className="a-skeleton" style={{ height:120, borderRadius:12 }} />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="a-empty">
          <div className="a-empty-icon">□</div>
          <div className="a-empty-text">No projects yet</div>
          <div className="a-empty-sub">Add your first project to showcase your work</div>
          <button onClick={()=>setEditing(BLANK)} className="a-btn a-btn-gold" style={{ marginTop:'1rem' }}>+ Add Project</button>
        </div>
      ) : (
        <div className="a-card" style={{ overflow:'hidden' }}>
          {projects.map((p, idx) => (
            <div key={p.id} style={{
              display:'grid',
              gridTemplateColumns:'minmax(0,1fr) auto',
              gap:'1rem',
              padding:'1.25rem 1.5rem',
              borderBottom: idx < projects.length-1 ? '1px solid var(--a-border)' : 'none',
            }}>
              <div style={{ minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.4rem', flexWrap:'wrap' }}>
                  <span style={{ fontWeight:700, color:'var(--a-text-1)', fontSize:'0.95rem' }}>{p.title}</span>
                  {p.featured && <span className="a-tag a-tag-gold">Featured</span>}
                  <span className="a-tag a-tag-blue">{p.status.replace('_', ' ')}</span>
                  {p.year && <span className="a-tag a-tag-purple">{p.year}</span>}
                </div>
                <p style={{
                  color:'var(--a-text-2)',
                  fontSize:'0.8rem',
                  marginBottom:'0.5rem',
                  overflow:'hidden',
                  textOverflow:'ellipsis',
                  whiteSpace:'nowrap',
                }}>
                  {p.outcome || p.solution || p.problem || p.description}
                </p>
                <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap' }}>
                  {p.tags.map(t=><span key={t} className="a-tag a-tag-blue">{t}</span>)}
                  {p.techStack.slice(0,4).map(t=><span key={t} className="a-tag a-tag-purple">{t}</span>)}
                </div>
              </div>
              <div style={{ display:'flex', gap:'0.5rem', flexShrink:0, alignItems:'flex-start' }}>
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="a-btn a-btn-ghost a-btn-xs">GitHub</a>
                )}
                <button onClick={()=>setEditing(p)} className="a-btn a-btn-outline-gold a-btn-xs">Edit</button>
                <button onClick={()=>del(p.id)} disabled={saving} className="a-btn a-btn-danger a-btn-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="a-modal-overlay" onClick={()=>setEditing(null)}>
          <div className="a-modal" style={{ maxWidth:760 }} onClick={e=>e.stopPropagation()}>
            <div className="a-modal-header">
              <h2 className="a-modal-title">{editing.id ? 'Edit Project' : 'Add New Project'}</h2>
              <button className="a-modal-close" onClick={()=>setEditing(null)}>×</button>
            </div>
            <form onSubmit={save}>
              <div className="a-modal-body" style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <div style={{ gridColumn:'span 2' }}>
                    {renderTextField({ label: 'Project Title *', field: 'title', ph: 'e.g. ElevIQ - GenAI Financial Assistant', required: true })}
                  </div>
                  {renderTextField({ label: 'Your Role', field: 'role', ph: 'Full-stack developer - AI, Firebase, dashboard UI' })}
                  {renderTextField({ label: 'Year', field: 'year', ph: '2025' })}
                  {renderTextField({ label: 'Problem Statement', field: 'problem', ph: 'What problem does this solve?' })}
                  {renderTextField({ label: 'Solution', field: 'solution', ph: 'How did you solve it?' })}
                  <div style={{ gridColumn:'span 2' }}>
                    {renderTextField({ label: 'Outcome / Recruiter Takeaway', field: 'outcome', ph: 'What changed because this project exists?' })}
                  </div>
                </div>

                {renderTextField({ label: 'Description', field: 'description', rows: 4, ph: 'Full case-study notes, features, constraints, and learnings...' })}

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  {renderTextField({ label: 'Thumbnail URL', field: 'thumbnailUrl', ph: 'https://...' })}
                  <div>
                    <label className="a-label">Status</label>
                    <select
                      value={editing.status}
                      onChange={e=>setField('status', e.target.value as ProjectStatus)}
                      style={inp}
                    >
                      <option value="COMPLETED">Completed</option>
                      <option value="IN_PROGRESS">In progress</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="a-label">Screenshot URLs (comma or newline separated)</label>
                    <textarea
                      value={joinList(editing.imageUrls)}
                      placeholder="https://..."
                      rows={3}
                      onChange={e=>setField('imageUrls', splitList(e.target.value))}
                      style={{...inp, resize:'vertical'}}
                    />
                  </div>
                  <div>
                    <label className="a-label">Metric Highlights (comma or newline separated)</label>
                    <textarea
                      value={joinList(editing.metricHighlights)}
                      placeholder="AI receipt parsing, Real-time dashboard"
                      rows={3}
                      onChange={e=>setField('metricHighlights', splitList(e.target.value))}
                      style={{...inp, resize:'vertical'}}
                    />
                  </div>
                  <div>
                    <label className="a-label">Tech Stack (comma-separated)</label>
                    <input
                      value={joinList(editing.techStack)}
                      placeholder="React, Firebase, AWS"
                      onChange={e=>setField('techStack', splitList(e.target.value))}
                      style={inp}
                    />
                  </div>
                  <div>
                    <label className="a-label">Tags (comma-separated)</label>
                    <input
                      value={joinList(editing.tags)}
                      placeholder="AI, Full-Stack"
                      onChange={e=>setField('tags', splitList(e.target.value))}
                      style={inp}
                    />
                  </div>
                  {renderTextField({ label: 'GitHub URL', field: 'githubUrl', ph: 'https://github.com/...' })}
                  {renderTextField({ label: 'Live Demo URL', field: 'liveUrl', ph: 'https://your-app.com' })}
                </div>

                <label style={{ display:'flex', alignItems:'center', gap:'0.65rem', cursor:'pointer', padding:'0.75rem', background:'rgba(255,255,255,0.02)', borderRadius:8, border:'1px solid var(--a-border)' }}>
                  <input type="checkbox" checked={editing.featured} onChange={()=>setField('featured', !editing.featured)} className="a-checkbox" />
                  <div>
                    <div style={{ color:'var(--a-text-1)', fontSize:'0.875rem', fontWeight:600 }}>Mark as Featured</div>
                    <div style={{ color:'var(--a-text-2)', fontSize:'0.75rem' }}>Featured projects receive stronger treatment on the public portfolio.</div>
                  </div>
                </label>
              </div>
              <div className="a-modal-footer">
                <button type="submit" disabled={saving} className="a-btn a-btn-gold">
                  {saving ? 'Saving...' : (editing.id ? 'Save Changes' : 'Add Project')}
                </button>
                <button type="button" onClick={()=>setEditing(null)} className="a-btn a-btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
