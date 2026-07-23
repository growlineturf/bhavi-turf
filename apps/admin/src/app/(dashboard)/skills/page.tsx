'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'

type Skill = { id:string; name:string; category:string; proficiency:number; iconSlug:string }
const CATS = ['LANGUAGE','FRAMEWORK','DATABASE','CLOUD','TOOL']
const BLANK: Skill = { id:'', name:'', category:'LANGUAGE', proficiency:75, iconSlug:'' }

const CAT_COLOR: Record<string,string> = {
  LANGUAGE:'a-tag-blue', FRAMEWORK:'a-tag-gold', DATABASE:'a-tag-green',
  CLOUD:'a-tag-purple', TOOL:'a-tag-blue'
}

const inp: React.CSSProperties = { width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:8, padding:'0.7rem 0.95rem', color:'#F0EEE8', fontSize:'0.875rem', fontFamily:'inherit', outline:'none' }

async function persist(skills: Skill[]) {
  return fetch('/api/portfolio/skills', {
    method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(skills),
  }).then(r=>r.json())
}

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Skill|null>(null)
  const [saving, setSaving]   = useState(false)
  const [status, setStatus]   = useState<'idle'|'success'|'error'>('idle')

  useEffect(() => {
    fetch('/api/portfolio/skills').then(r=>r.json())
      .then(d => { if(d.success) setSkills(d.data) })
      .finally(() => setLoading(false))
  }, [])

  const flash = (ok:boolean) => { setStatus(ok?'success':'error'); setTimeout(()=>setStatus('idle'),3000) }

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); if(!editing) return
    setSaving(true)
    const updated = editing.id
      ? skills.map(s => s.id===editing.id ? editing : s)
      : [...skills, {...editing, id:Date.now().toString()}]
    const d = await persist(updated)
    setSaving(false)
    if(d.success) { setSkills(updated); setEditing(null) }
    flash(d.success)
  }

  const del = async (id:string) => {
    if(!confirm('Delete this skill?')) return
    setSaving(true)
    const updated = skills.filter(s=>s.id!==id)
    const d = await persist(updated)
    setSaving(false)
    if(d.success) setSkills(updated)
    flash(d.success)
  }

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem' }}>
          <div>
            <h1 className="admin-page-title">Skills</h1>
            <p className="admin-page-sub">Manage your technical skills, categories and proficiency levels.</p>
          </div>
          <button onClick={()=>setEditing(BLANK)} className="a-btn a-btn-gold">+ Add Skill</button>
        </div>
      </div>

      {status==='success' && <div className="a-toast a-toast-success">✓ Skills saved to portfolio!</div>}
      {status==='error'   && <div className="a-toast a-toast-error">✗ Save failed. Try again.</div>}

      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'0.875rem' }}>
          {[...Array(8)].map((_,i)=><div key={i} className="a-skeleton" style={{ height:72 }} />)}
        </div>
      ) : (
        CATS.map(cat => {
          const group = skills.filter(s=>s.category===cat)
          if(!group.length) return null
          return (
            <div key={cat} style={{ marginBottom:'2rem' }}>
              <div className="a-section-title">{cat}</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'0.75rem' }}>
                {group.map(s => (
                  <div key={s.id} className="a-card a-card-hover" style={{ padding:'1rem', display:'flex', alignItems:'center', gap:'0.875rem' }}>
                    <Image
                      src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${s.iconSlug}/${s.iconSlug}-original.svg`}
                      alt={s.name} width={28} height={28}
                      unoptimized
                      onError={e=>{e.currentTarget.style.display='none'}}
                    />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:600, color:'var(--a-text-1)', fontSize:'0.875rem' }}>{s.name}</div>
                      <div style={{ width:'100%', height:3, background:'var(--a-border)', borderRadius:2, marginTop:'0.35rem', overflow:'hidden' }}>
                        <div style={{ width:`${s.proficiency}%`, height:'100%', background:'var(--a-gold)', borderRadius:2, transition:'width 0.5s ease' }} />
                      </div>
                      <div style={{ fontSize:'0.65rem', color:'var(--a-text-3)', marginTop:'0.15rem' }}>{s.proficiency}%</div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'0.3rem', flexShrink:0 }}>
                      <button onClick={()=>setEditing(s)} className="a-btn a-btn-outline-gold a-btn-xs">Edit</button>
                      <button onClick={()=>del(s.id)} disabled={saving} className="a-btn a-btn-danger a-btn-xs">Del</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}

      {!loading && skills.length===0 && (
        <div className="a-empty">
          <div className="a-empty-icon">🛠️</div>
          <div className="a-empty-text">No skills added yet</div>
          <button onClick={()=>setEditing(BLANK)} className="a-btn a-btn-gold" style={{ marginTop:'1rem' }}>+ Add Skill</button>
        </div>
      )}

      {editing && (
        <div className="a-modal-overlay" onClick={()=>setEditing(null)}>
          <div className="a-modal" style={{ maxWidth:460 }} onClick={e=>e.stopPropagation()}>
            <div className="a-modal-header">
              <h2 className="a-modal-title">{editing.id ? 'Edit Skill' : 'Add Skill'}</h2>
              <button className="a-modal-close" onClick={()=>setEditing(null)}>✕</button>
            </div>
            <form onSubmit={save}>
              <div className="a-modal-body" style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div>
                  <label className="a-label">Skill Name *</label>
                  <input value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})}
                    required placeholder="e.g. React.js" style={inp} />
                </div>
                <div>
                  <label className="a-label">Icon Slug (devicons.dev)</label>
                  <input value={editing.iconSlug} onChange={e=>setEditing({...editing,iconSlug:e.target.value})}
                    placeholder="e.g. react, python, java" style={inp} />
                  {editing.iconSlug && (
                    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginTop:'0.5rem', padding:'0.6rem 0.8rem', background:'rgba(255,255,255,0.02)', borderRadius:8, border:'1px solid var(--a-border)' }}>
                      <Image src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${editing.iconSlug}/${editing.iconSlug}-original.svg`}
                        alt="" width={22} height={22} unoptimized onError={e=>{e.currentTarget.style.display='none'}} />
                      <span style={{ fontSize:'0.75rem', color:'var(--a-text-2)' }}>Icon preview</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="a-label">Category</label>
                  <select value={editing.category} onChange={e=>setEditing({...editing,category:e.target.value})}
                    className="a-input a-select" style={{ background:'#13131f' }}>
                    {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <label className="a-label" style={{ margin:0 }}>Proficiency</label>
                    <span style={{ fontWeight:700, color:'var(--a-gold)', fontSize:'0.88rem' }}>{editing.proficiency}%</span>
                  </div>
                  <input type="range" min={10} max={100} value={editing.proficiency}
                    onChange={e=>setEditing({...editing,proficiency:Number(e.target.value)})}
                    className="a-range" style={{ marginTop:'0.5rem' }} />
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.65rem', color:'var(--a-text-3)', marginTop:'0.25rem' }}>
                    <span>Beginner</span><span>Intermediate</span><span>Expert</span>
                  </div>
                  <span className={`a-tag ${CAT_COLOR[editing.category] ?? 'a-tag-gold'}`} style={{ marginTop:'0.5rem', display:'inline-flex' }}>
                    {editing.category}
                  </span>
                </div>
              </div>
              <div className="a-modal-footer">
                <button type="submit" disabled={saving} className="a-btn a-btn-gold">
                  {saving ? '⟳ Saving…' : (editing.id ? '✓ Update' : '+ Add')}
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
