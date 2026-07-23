'use client'

import { useEffect, useRef, useState } from 'react'
import { FileText, Loader2, Trash2, Upload } from 'lucide-react'
import { LoadingState, PageHead } from '@/components/editor-kit'

export default function ResumePage() {
  const [status, setStatus] = useState<{ exists: boolean; url: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/resume')
      .then((r) => r.json())
      .then((d) => setStatus({ exists: !!d.exists, url: d.url || '' }))
      .catch(() => setStatus({ exists: false, url: '' }))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const upload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setMsg({ kind: 'err', text: 'Please choose a PDF file.' })
      return
    }
    setBusy(true)
    setMsg(null)
    const fd = new FormData()
    fd.append('resume', file)
    try {
      const d = await fetch('/api/resume', { method: 'POST', body: fd }).then((r) => r.json())
      if (d.success) {
        setStatus({ exists: true, url: d.url || '' })
        setMsg({ kind: 'ok', text: 'Résumé uploaded — the CV download button now serves this file.' })
      } else {
        setMsg({ kind: 'err', text: d.error || 'Upload failed.' })
      }
    } catch {
      setMsg({ kind: 'err', text: 'Network error.' })
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const remove = async () => {
    if (!confirm('Remove the current résumé?')) return
    setBusy(true)
    setMsg(null)
    try {
      await fetch('/api/resume', { method: 'DELETE' })
      setStatus({ exists: false, url: '' })
      setMsg({ kind: 'ok', text: 'Résumé removed.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageHead title="Résumé" sub="Upload the PDF served by the “Download CV” button across the portfolio." />

      {loading ? (
        <LoadingState rows={2} />
      ) : (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div className="quick-ico" style={{ width: 48, height: 48 }}>
              <FileText size={22} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 700 }}>{status?.exists ? 'Résumé is live' : 'No résumé uploaded'}</div>
              <div className="muted" style={{ fontSize: '0.86rem' }}>
                {status?.exists ? 'Recruiters can download your CV from the portfolio.' : 'Upload a PDF to enable the download button.'}
              </div>
            </div>
            {status?.exists && status.url && (
              <a href={status.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                View current
              </a>
            )}
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) upload(f)
              }}
            />
            <button type="button" className="btn btn-dark" disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? <Loader2 size={16} className="spin" /> : <Upload size={16} />} {status?.exists ? 'Replace résumé' : 'Upload résumé'}
            </button>
            {status?.exists && (
              <button type="button" className="btn btn-danger" disabled={busy} onClick={remove}>
                <Trash2 size={16} /> Remove
              </button>
            )}
          </div>

          {msg && (
            <div className="save-status" style={{ marginTop: 16, color: msg.kind === 'ok' ? '#157347' : 'var(--danger)' }}>
              {msg.text}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
