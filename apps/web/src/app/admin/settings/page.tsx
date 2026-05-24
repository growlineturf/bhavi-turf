'use client'
import { useState, useEffect, useRef } from 'react'

export default function SettingsPage() {
  // Resume state
  const [resumeExists, setResumeExists]   = useState(false)
  const [uploading, setUploading]         = useState(false)
  const [uploadStatus, setUploadStatus]   = useState<'idle'|'success'|'error'>('idle')
  const [uploadMsg, setUploadMsg]         = useState('')
  const [dragOver, setDragOver]           = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Password state
  const [pwForm, setPwForm]     = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw]     = useState({ current: false, next: false, confirm: false })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwStatus, setPwStatus] = useState<'idle'|'success'|'error'>('idle')
  const [pwMsg, setPwMsg]       = useState('')

  useEffect(() => {
    fetch('/api/admin/resume').then(r => r.json()).then(d => {
      if (d.success) setResumeExists(d.exists)
    })
  }, [])

  const flashUpload = (ok: boolean, msg: string) => {
    setUploadStatus(ok ? 'success' : 'error')
    setUploadMsg(msg)
    setTimeout(() => setUploadStatus('idle'), 4000)
  }

  const uploadResume = async (file: File) => {
    if (file.type !== 'application/pdf') {
      flashUpload(false, 'Only PDF files are accepted.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      flashUpload(false, 'File is too large. Max size is 10 MB.')
      return
    }
    setUploading(true)
    const fd = new FormData()
    fd.append('resume', file)
    const d = await fetch('/api/admin/resume', { method: 'POST', body: fd }).then(r => r.json())
    setUploading(false)
    if (d.success) setResumeExists(true)
    flashUpload(d.success, d.success ? 'Resume uploaded! The Download Resume button now works.' : (d.error ?? 'Upload failed'))
  }

  const deleteResume = async () => {
    if (!confirm('Remove your resume? Visitors will get a 404 until you upload a new one.')) return
    const d = await fetch('/api/admin/resume', { method: 'DELETE' }).then(r => r.json())
    if (d.success) { setResumeExists(false); flashUpload(true, 'Resume removed.') }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwForm.next !== pwForm.confirm) {
      setPwStatus('error'); setPwMsg('New passwords do not match.')
      setTimeout(() => setPwStatus('idle'), 4000)
      return
    }
    if (pwForm.next.length < 6) {
      setPwStatus('error'); setPwMsg('New password must be at least 6 characters.')
      setTimeout(() => setPwStatus('idle'), 4000)
      return
    }
    setPwSaving(true)
    const d = await fetch('/api/admin/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
    }).then(r => r.json())
    setPwSaving(false)
    setPwStatus(d.success ? 'success' : 'error')
    setPwMsg(d.success ? 'Password changed! Use your new password next time you log in.' : (d.error ?? 'Failed to change password'))
    if (d.success) setPwForm({ current: '', next: '', confirm: '' })
    setTimeout(() => setPwStatus('idle'), 5000)
  }

  const pwStrength = (pw: string) => {
    if (!pw) return null
    if (pw.length < 6) return { label: 'Too short', color: '#EF4444', w: '20%' }
    if (pw.length < 10) return { label: 'Weak', color: '#F59E0B', w: '40%' }
    if (!/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) return { label: 'Fair', color: '#F59E0B', w: '60%' }
    if (pw.length >= 12 && /[^A-Za-z0-9]/.test(pw)) return { label: 'Strong', color: '#22C55E', w: '100%' }
    return { label: 'Good', color: '#22C55E', w: '80%' }
  }

  const strength = pwStrength(pwForm.next)

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Settings</h1>
        <p className="admin-page-sub">Manage your resume file and admin account security.</p>
      </div>

      {/* ── Resume Upload ───────────────────── */}
      <div className="a-card" style={{ marginBottom: '1.5rem', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--a-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--a-gold-dim)', border: '1px solid var(--a-border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>📄</div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--a-text-1)', fontSize: '0.95rem' }}>Resume / CV</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--a-text-2)', marginTop: '0.1rem' }}>
              Upload a PDF — powers the &ldquo;Download Resume&rdquo; button on your portfolio
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span className={`a-tag ${resumeExists ? 'a-tag-green' : 'a-tag-gold'}`}>
              {resumeExists ? '✓ Uploaded' : '✗ Missing'}
            </span>
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {uploadStatus === 'success' && <div className="a-toast a-toast-success" style={{ marginBottom: '1.25rem' }}>✓ {uploadMsg}</div>}
          {uploadStatus === 'error'   && <div className="a-toast a-toast-error"   style={{ marginBottom: '1.25rem' }}>✗ {uploadMsg}</div>}

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) uploadResume(f) }}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? 'var(--a-gold)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 'var(--a-radius)',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? 'var(--a-gold-dim)' : 'rgba(255,255,255,0.015)',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem', opacity: 0.7 }}>
              {uploading ? '⟳' : '📤'}
            </div>
            <div style={{ color: 'var(--a-text-1)', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.9rem' }}>
              {uploading ? 'Uploading…' : 'Drop your PDF here or click to browse'}
            </div>
            <div style={{ color: 'var(--a-text-3)', fontSize: '0.75rem' }}>PDF only · Max 10 MB</div>
          </div>

          <input ref={fileRef} type="file" accept=".pdf,application/pdf" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadResume(f) }} />

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="a-btn a-btn-gold">
              {uploading ? '⟳ Uploading…' : '↑ Upload New PDF'}
            </button>
            {resumeExists && (
              <>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="a-btn a-btn-outline-gold">
                  ↗ Preview Resume
                </a>
                <button onClick={deleteResume} className="a-btn a-btn-danger">
                  🗑 Remove Resume
                </button>
              </>
            )}
          </div>

          {!resumeExists && (
            <div style={{ marginTop: '1rem', padding: '0.875rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 'var(--a-radius-sm)', fontSize: '0.8rem', color: '#f87171', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0 }}>⚠</span>
              <span>No resume uploaded yet. The &ldquo;Download Resume&rdquo; button on your portfolio is currently broken. Upload a PDF above to fix it.</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Change Password ─────────────────── */}
      <div className="a-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--a-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🔑</div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--a-text-1)', fontSize: '0.95rem' }}>Change Password</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--a-text-2)', marginTop: '0.1rem' }}>
              Update your admin panel password. Takes effect immediately.
            </div>
          </div>
        </div>

        <form onSubmit={changePassword} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {pwStatus === 'success' && <div className="a-toast a-toast-success" style={{ margin: 0 }}>✓ {pwMsg}</div>}
          {pwStatus === 'error'   && <div className="a-toast a-toast-error"   style={{ margin: 0 }}>✗ {pwMsg}</div>}

          {/* Current password */}
          <div>
            <label className="a-label">Current Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw.current ? 'text' : 'password'} value={pwForm.current} required
                onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
                placeholder="Your current password" className="a-input" style={{ paddingRight: '3rem' }} />
              <button type="button" onClick={() => setShowPw(s => ({ ...s, current: !s.current }))}
                style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--a-text-3)', fontSize: '0.85rem' }}>
                {showPw.current ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* New password */}
            <div>
              <label className="a-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw.next ? 'text' : 'password'} value={pwForm.next} required
                  onChange={e => setPwForm({ ...pwForm, next: e.target.value })}
                  placeholder="Min. 6 characters" className="a-input" style={{ paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPw(s => ({ ...s, next: !s.next }))}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--a-text-3)', fontSize: '0.85rem' }}>
                  {showPw.next ? '🙈' : '👁️'}
                </button>
              </div>
              {/* Strength bar */}
              {strength && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ height: 3, background: 'var(--a-border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: strength.w, height: '100%', background: strength.color, borderRadius: 2, transition: 'width 0.3s, background 0.3s' }} />
                  </div>
                  <div style={{ fontSize: '0.68rem', color: strength.color, marginTop: '0.2rem', fontWeight: 600 }}>{strength.label}</div>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="a-label">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw.confirm ? 'text' : 'password'} value={pwForm.confirm} required
                  onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                  placeholder="Repeat new password" className="a-input"
                  style={{ paddingRight: '3rem', borderColor: pwForm.confirm && pwForm.confirm !== pwForm.next ? 'var(--a-error)' : '' }} />
                <button type="button" onClick={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--a-text-3)', fontSize: '0.85rem' }}>
                  {showPw.confirm ? '🙈' : '👁️'}
                </button>
              </div>
              {pwForm.confirm && pwForm.confirm !== pwForm.next && (
                <div style={{ fontSize: '0.72rem', color: 'var(--a-error)', marginTop: '0.3rem' }}>Passwords do not match</div>
              )}
            </div>
          </div>

          <div style={{ padding: '0.875rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--a-radius-sm)', border: '1px solid var(--a-border)', fontSize: '0.78rem', color: 'var(--a-text-2)' }}>
            💡 <strong style={{ color: 'var(--a-text-1)' }}>Tip:</strong> Use a mix of uppercase, numbers and symbols for a strong password. Your session stays active after changing.
          </div>

          <div>
            <button type="submit" disabled={pwSaving || !pwForm.current || !pwForm.next || !pwForm.confirm} className="a-btn a-btn-gold">
              {pwSaving ? '⟳ Saving…' : '🔑 Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
