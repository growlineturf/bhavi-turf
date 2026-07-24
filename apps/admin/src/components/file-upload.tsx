'use client'

import { useRef, useState } from 'react'
import { FileText, ImageIcon, Loader2, Upload, Video, X } from 'lucide-react'

async function uploadFile(file: File): Promise<{ url: string; mimeType: string } | { error: string }> {
  const fd = new FormData()
  fd.append('file', file)
  try {
    const d = await fetch('/api/assets', { method: 'POST', body: fd }).then((r) => r.json())
    if (d.success) return { url: d.url, mimeType: d.mimeType }
    return { error: d.error || 'Upload failed' }
  } catch {
    return { error: 'Network error' }
  }
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov)$/i.test(url) || url.includes('video')
}

/* ---------- Single file (avatar, thumbnail, cert badge) ---------- */
export function FileUpload({
  value,
  onChange,
  accept = 'image/*',
  kind = 'image',
  hint,
}: {
  value: string
  onChange: (url: string) => void
  accept?: string
  kind?: 'image' | 'file'
  hint?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const pick = async (file?: File) => {
    if (!file) return
    setBusy(true)
    setErr('')
    const res = await uploadFile(file)
    setBusy(false)
    if ('url' in res) onChange(res.url)
    else setErr(res.error)
    if (ref.current) ref.current.value = ''
  }

  return (
    <div className="upload">
      <input ref={ref} type="file" accept={accept} hidden onChange={(e) => pick(e.target.files?.[0])} />
      {value ? (
        <div className="upload-preview">
          {kind === 'image' && !isVideo(value) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" className="upload-thumb" />
          ) : (
            <span className="upload-fileicon">{kind === 'image' ? <ImageIcon size={20} /> : <FileText size={20} />}</span>
          )}
          <div className="upload-meta">
            <span className="upload-name">{value.startsWith('/api/assets/') ? 'Uploaded file' : value}</span>
            <div className="upload-actions">
              <button type="button" className="btn btn-sm" onClick={() => ref.current?.click()} disabled={busy}>
                {busy ? <Loader2 size={14} className="spin" /> : <Upload size={14} />} Replace
              </button>
              <a href={value} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">View</a>
              <button type="button" className="icon-btn danger" onClick={() => onChange('')} aria-label="Remove">
                <X size={15} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button type="button" className="upload-drop" onClick={() => ref.current?.click()} disabled={busy}>
          {busy ? <Loader2 size={18} className="spin" /> : kind === 'image' ? <ImageIcon size={18} /> : <Upload size={18} />}
          <span>{busy ? 'Uploading…' : `Upload ${kind === 'image' ? 'image' : 'file'}`}</span>
        </button>
      )}
      {(err || hint) && <span className="field-hint" style={err ? { color: 'var(--danger)' } : undefined}>{err || hint}</span>}
    </div>
  )
}

/* ---------- Multiple files (project gallery: images + video) ---------- */
export function FileUploadMulti({
  values,
  onChange,
  accept = 'image/*,video/*',
  hint,
}: {
  values: string[]
  onChange: (next: string[]) => void
  accept?: string
  hint?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const pick = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setBusy(true)
    setErr('')
    const added: string[] = []
    for (const file of Array.from(files)) {
      const res = await uploadFile(file)
      if ('url' in res) added.push(res.url)
      else setErr(res.error)
    }
    setBusy(false)
    if (added.length) onChange([...values, ...added])
    if (ref.current) ref.current.value = ''
  }

  return (
    <div className="upload">
      <input ref={ref} type="file" accept={accept} multiple hidden onChange={(e) => pick(e.target.files)} />
      {values.length > 0 && (
        <div className="upload-grid">
          {values.map((url, i) => (
            <div className="upload-tile" key={`${url}-${i}`}>
              {isVideo(url) ? (
                <span className="upload-fileicon"><Video size={18} /></span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={`media ${i + 1}`} />
              )}
              <button type="button" className="upload-tile-x" onClick={() => onChange(values.filter((_, j) => j !== i))} aria-label="Remove">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
      <button type="button" className="upload-drop" onClick={() => ref.current?.click()} disabled={busy}>
        {busy ? <Loader2 size={18} className="spin" /> : <Upload size={18} />}
        <span>{busy ? 'Uploading…' : 'Add media (image / video)'}</span>
      </button>
      {(err || hint) && <span className="field-hint" style={err ? { color: 'var(--danger)' } : undefined}>{err || hint}</span>}
    </div>
  )
}
