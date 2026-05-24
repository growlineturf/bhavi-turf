'use client'
import { useState, useEffect } from 'react'

type Exp = { id:string; company:string; role:string; period:string; type:string; location:string; highlights:string[]; tech:string[] }
const BLANK: Exp = { id:'', company:'', role:'', period:'', type:'INTERNSHIP', location:'', highlights:[], tech:[] }
const EXP_TYPES = ['INTERNSHIP','FULL_TIME','PART_TIME','FREELANCE','CONTRACT']

const inp: React.CSSProperties = { width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:8, padding:'0.7rem 0.95rem', color:'#F0EEE8', fontSize:'0.875rem', fontFamily:'inherit', outline:'none' }

const TYPE_LABEL: Record<string,string> = { INTERNSHIP:'Internship', FULL_TIME:'Full-Time', PART_TIME:'Part-Time', FREELANCE:'Freelance', CONTRACT:'Contract' }

async function persistExp(data: Exp[]) {
  return fetch('/api/admin/portfolio/experience', {
    method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data),
  }).then(r=>r.json())
}

export default function ExperiencePage() {
  const [exp, setExp]       = useState<Exp[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Exp|null>(null)
  const [saving, setSaving]   = useState(false)
  const [status, setStatus]   = useState<'idle'|'success'|'error'>('idle')

  useEffect(() => {
    fetch('/api/admin/portfolio/experience').then(r=>r.json())
      .then(d => { if(d.success) setExp(d.data) })
      .finally(() => setLoading(false))
  }, [])

  const flash = (ok:boolean) => { setStatus(ok?'success':'error'); setTimeout(()=>setStatus('idle'),3000) }

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); if(!editing) return
    setSaving(true)
    const updated = editing.id
      ? exp.map(x => x.id===editing.id ? editing : x)
      : [...exp, {...editing, id:Date.now().toString()}]
    const d = await persistExp(updated)
    setSaving(false)
    if(d.success) { setExp(updated); setEditing(null) }
    flash(d.success)
  }

  const del = async (id:string) => {
    if(!confirm('Delete this experience entry?')) return
    setSaving(true)
    const updated = exp.filter(x=>x.id!==id)
    const d = await persistExp(updated)
    setSaving(false)
    if(d.success) setExp(updated)
    flash(d.success)
  }

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem' }}>
          <div>
            <h1 className="admin-page-title">Work Experience</h1>
            <p className="admin-page-sub">Manage your work history and internship entries.</p>
          </div>
          <button onClick={()=>setEditing(BLANK)} className="a-btn a-btn-gold">+ Add Experience</button>
        </div>
      </div>

      {status==='success' && <div className="a-toast a-toast-success">✓ Experience saved to portfolio!</div>}
      {status==='error'   && <div className="a-toast a-toast-error">✗ Save failed. Try again.</div>}

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
          {[...Array(2)].map((_,i)=><div key={i} className="a-skeleton" style={{ height:90 }} />)}
        </div>
      ) : exp.length === 0 ? (
        <div className="a-empty">
          <div className="a-empty-icon">💼</div>
          <div className="a-empty-text">No experience entries yet</div>
          <button onClick={()=>setEditing(BLANK)} className="a-btn a-btn-gold" style={{ marginTop:'1rem' }}>+ Add Experience</button>
        </div>
      ) : (
        <div className="a-card" style={{ overflow:'hidden' }}>
          {exp.map((e, idx) => (
            <div key={e.id} style={{
              display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem',
              padding:'1.25rem 1.5rem',
              borderBottom: idx < exp.length-1 ? '1px solid var(--a-border)' : 'none',
              transition:'background 0.15s'
            }}
              onMouseEnter={ev=>(ev.currentTarget.style.background='rgba(255,255,255,0.015)')}
              onMouseLeave={ev=>(ev.currentTarget.style.background='transparent')}>
              <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start', flex:1 }}>
                <div style={{
                  width:42, height:42, borderRadius:10, background:'var(--a-gold-dim)',
                  border:'1px solid var(--a-border-gold)', display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:'1.1rem', flexShrink:0,
                }}>💼</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap' }}>
                    <span style={{ fontWeight:700, color:'var(--a-text-1)', fontSize:'0.95rem' }}>{e.role}</span>
                    <span className="a-tag a-tag-gold">{TYPE_LABEL[e.type] ?? e.type}</span>
                  </div>
                  <div style={{ color:'var(--a-gold)', fontSize:'0.82rem', marginTop:'0.15rem' }}>
                    {e.company}{e.location ? ` · ${e.location}` : ''}
                  </div>
                  <div style={{ color:'var(--a-text-3)', fontSize:'0.75rem', marginTop:'0.1rem' }}>{e.period}</div>
                  {e.highlights.length > 0 && (
                    <div style={{ marginTop:'0.5rem', display:'flex', flexDirection:'column', gap:'0.2rem' }}>
                      {e.highlights.slice(0,2).map(h=>(
                        <div key={h} style={{ fontSize:'0.78rem', color:'var(--a-text-2)', display:'flex', gap:'0.4rem' }}>
                          <span style={{ color:'var(--a-gold)', flexShrink:0 }}>▸</span> {h}
                        </div>
                      ))}
                      {e.highlights.length > 2 && <div style={{ fontSize:'0.72rem', color:'var(--a-text-3)' }}>+{e.highlights.length-2} more</div>}
                    </div>
                  )}
                  <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap', marginTop:'0.5rem' }}>
                    {e.tech.map(t=><span key={t} className="a-tag a-tag-blue">{t}</span>)}
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', gap:'0.5rem', flexShrink:0 }}>
                <button onClick={()=>setEditing(e)} className="a-btn a-btn-outline-gold a-btn-xs">Edit</button>
                <button onClick={()=>del(e.id)} disabled={saving} className="a-btn a-btn-danger a-btn-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="a-modal-overlay" onClick={()=>setEditing(null)}>
          <div className="a-modal" style={{ maxWidth:580 }} onClick={e=>e.stopPropagation()}>
            <div className="a-modal-header">
              <h2 className="a-modal-title">{editing.id ? 'Edit Experience' : 'Add Experience'}</h2>
              <button className="a-modal-close" onClick={()=>setEditing(null)}>✕</button>
            </div>
            <form onSubmit={save}>
              <div className="a-modal-body" style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <div>
                    <label className="a-label">Company *</label>
                    <input value={editing.company} onChange={e=>setEditing({...editing,company:e.target.value})} required placeholder="e.g. Google" style={inp} />
                  </div>
                  <div>
                    <label className="a-label">Role / Position *</label>
                    <input value={editing.role} onChange={e=>setEditing({...editing,role:e.target.value})} required placeholder="e.g. Software Engineer" style={inp} />
                  </div>
                  <div>
                    <label className="a-label">Duration</label>
                    <input value={editing.period} onChange={e=>setEditing({...editing,period:e.target.value})} placeholder="Jan 2024 – Mar 2024" style={inp} />
                  </div>
                  <div>
                    <label className="a-label">Location</label>
                    <input value={editing.location} onChange={e=>setEditing({...editing,location:e.target.value})} placeholder="City, Country (optional)" style={inp} />
                  </div>
                  <div style={{ gridColumn:'span 2' }}>
                    <label className="a-label">Employment Type</label>
                    <select value={editing.type} onChange={e=>setEditing({...editing,type:e.target.value})}
                      className="a-input a-select" style={{ background:'#13131f' }}>
                      {EXP_TYPES.map(t=><option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="a-label">Key Highlights (one per line)</label>
                  <textarea value={editing.highlights.join('\n')} rows={4}
                    onChange={e=>setEditing({...editing,highlights:e.target.value.split('\n').filter(Boolean)})}
                    placeholder="Developed REST APIs with Node.js&#10;Improved performance by 40%&#10;Collaborated with cross-functional teams"
                    style={{...inp, resize:'vertical'}} />
                </div>
                <div>
                  <label className="a-label">Tech Stack (comma-separated)</label>
                  <input value={editing.tech.join(', ')} onChange={e=>setEditing({...editing,tech:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                    placeholder="Java, Spring Boot, AWS" style={inp} />
                </div>
              </div>
              <div className="a-modal-footer">
                <button type="submit" disabled={saving} className="a-btn a-btn-gold">
                  {saving ? '⟳ Saving…' : (editing.id ? '✓ Save Changes' : '+ Add Experience')}
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
