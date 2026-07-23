'use client'
import { useState, useEffect } from 'react'

type Cert = { id:string; name:string; issuer:string; date:string; credentialUrl:string }
const BLANK: Cert = { id:'', name:'', issuer:'', date:'', credentialUrl:'' }

const inp: React.CSSProperties = { width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:8, padding:'0.7rem 0.95rem', color:'#F0EEE8', fontSize:'0.875rem', fontFamily:'inherit', outline:'none' }

async function persistCerts(data: Cert[]) {
  return fetch('/api/portfolio/certifications', {
    method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data),
  }).then(r=>r.json())
}

export default function CertificationsPage() {
  const [certs, setCerts]   = useState<Cert[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Cert|null>(null)
  const [saving, setSaving]   = useState(false)
  const [status, setStatus]   = useState<'idle'|'success'|'error'>('idle')

  useEffect(() => {
    fetch('/api/portfolio/certifications').then(r=>r.json())
      .then(d => { if(d.success) setCerts(d.data) })
      .finally(() => setLoading(false))
  }, [])

  const flash = (ok:boolean) => { setStatus(ok?'success':'error'); setTimeout(()=>setStatus('idle'),3000) }

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); if(!editing) return
    setSaving(true)
    const updated = editing.id
      ? certs.map(c => c.id===editing.id ? editing : c)
      : [...certs, {...editing, id:Date.now().toString()}]
    const d = await persistCerts(updated)
    setSaving(false)
    if(d.success) { setCerts(updated); setEditing(null) }
    flash(d.success)
  }

  const del = async (id:string) => {
    if(!confirm('Delete this certification?')) return
    setSaving(true)
    const updated = certs.filter(c=>c.id!==id)
    const d = await persistCerts(updated)
    setSaving(false)
    if(d.success) setCerts(updated)
    flash(d.success)
  }

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem' }}>
          <div>
            <h1 className="admin-page-title">Certifications</h1>
            <p className="admin-page-sub">Manage your certificates and credentials. They appear on the portfolio experience section.</p>
          </div>
          <button onClick={()=>setEditing(BLANK)} className="a-btn a-btn-gold">+ Add Certificate</button>
        </div>
      </div>

      {status==='success' && <div className="a-toast a-toast-success">✓ Certifications saved to portfolio!</div>}
      {status==='error'   && <div className="a-toast a-toast-error">✗ Save failed. Try again.</div>}

      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'0.875rem' }}>
          {[...Array(4)].map((_,i)=><div key={i} className="a-skeleton" style={{ height:80 }} />)}
        </div>
      ) : certs.length === 0 ? (
        <div className="a-empty">
          <div className="a-empty-icon">🏅</div>
          <div className="a-empty-text">No certifications yet</div>
          <div className="a-empty-sub">Add your certificates to showcase your learning</div>
          <button onClick={()=>setEditing(BLANK)} className="a-btn a-btn-gold" style={{ marginTop:'1rem' }}>+ Add Certificate</button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'0.875rem' }}>
          {certs.map(c => (
            <div key={c.id} className="a-card a-card-hover" style={{ padding:'1.25rem', display:'flex', gap:'1rem', alignItems:'flex-start' }}>
              <div style={{
                width:44, height:44, borderRadius:10, background:'var(--a-gold-dim)',
                border:'1px solid var(--a-border-gold)', display:'flex', alignItems:'center',
                justifyContent:'center', fontSize:'1.25rem', flexShrink:0,
              }}>🏅</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, color:'var(--a-text-1)', fontSize:'0.88rem', marginBottom:'0.2rem' }}>{c.name}</div>
                <div style={{ color:'var(--a-gold)', fontSize:'0.78rem' }}>{c.issuer}</div>
                {c.date && <div style={{ color:'var(--a-text-3)', fontSize:'0.72rem', marginTop:'0.15rem' }}>{c.date}</div>}
                {c.credentialUrl && (
                  <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize:'0.72rem', color:'var(--a-text-3)', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.2rem', marginTop:'0.2rem' }}>
                    ↗ View Credential
                  </a>
                )}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.3rem', flexShrink:0 }}>
                <button onClick={()=>setEditing(c)} className="a-btn a-btn-outline-gold a-btn-xs">Edit</button>
                <button onClick={()=>del(c.id)} disabled={saving} className="a-btn a-btn-danger a-btn-xs">Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="a-modal-overlay" onClick={()=>setEditing(null)}>
          <div className="a-modal" style={{ maxWidth:480 }} onClick={e=>e.stopPropagation()}>
            <div className="a-modal-header">
              <h2 className="a-modal-title">{editing.id ? 'Edit Certificate' : 'Add Certificate'}</h2>
              <button className="a-modal-close" onClick={()=>setEditing(null)}>✕</button>
            </div>
            <form onSubmit={save}>
              <div className="a-modal-body" style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div>
                  <label className="a-label">Certificate Name *</label>
                  <input value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})}
                    required placeholder="e.g. AWS Certified Solutions Architect" style={inp} />
                </div>
                <div>
                  <label className="a-label">Issuing Organisation *</label>
                  <input value={editing.issuer} onChange={e=>setEditing({...editing,issuer:e.target.value})}
                    required placeholder="e.g. Amazon Web Services" style={inp} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <div>
                    <label className="a-label">Date Issued</label>
                    <input value={editing.date} onChange={e=>setEditing({...editing,date:e.target.value})}
                      placeholder="e.g. Dec 2025" style={inp} />
                  </div>
                  <div>
                    <label className="a-label">Credential URL</label>
                    <input value={editing.credentialUrl} onChange={e=>setEditing({...editing,credentialUrl:e.target.value})}
                      placeholder="https://..." style={inp} />
                  </div>
                </div>
              </div>
              <div className="a-modal-footer">
                <button type="submit" disabled={saving} className="a-btn a-btn-gold">
                  {saving ? '⟳ Saving…' : (editing.id ? '✓ Save Changes' : '+ Add Certificate')}
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
