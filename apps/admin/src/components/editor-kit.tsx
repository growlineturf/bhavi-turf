'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import {
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Data hook — GET/PUT /api/portfolio/[section]                       */
/* ------------------------------------------------------------------ */
export function useSection<T>(section: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle')
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/portfolio/${section}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d.data)
        else setError(d.error || 'Failed to load')
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false))
  }, [section])

  useEffect(() => {
    load()
  }, [load])

  const save = useCallback(
    async (payload: T) => {
      setSaving(true)
      setStatus('idle')
      setError('')
      try {
        const res = await fetch(`/api/portfolio/${section}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const d = await res.json()
        if (d.success) {
          setData(d.data)
          setStatus('ok')
        } else {
          setStatus('err')
          setError(d.error === 'VALIDATION_ERROR' ? 'Some fields are invalid — check required fields.' : d.error || 'Save failed')
        }
      } catch {
        setStatus('err')
        setError('Network error')
      } finally {
        setSaving(false)
        setTimeout(() => setStatus('idle'), 4500)
      }
    },
    [section]
  )

  return { data, setData, loading, saving, status, error, save, reload: load }
}

/* ------------------------------------------------------------------ */
/*  Layout primitives                                                  */
/* ------------------------------------------------------------------ */
export function PageHead({
  title,
  sub,
  actions,
}: {
  title: string
  sub?: string
  actions?: ReactNode
}) {
  return (
    <div className="page-head" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <div>
        <h1 className="page-title">{title}</h1>
        {sub && <p className="page-sub">{sub}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10 }}>{actions}</div>}
    </div>
  )
}

export function Field({
  label,
  hint,
  full,
  children,
}: {
  label?: string
  hint?: string
  full?: boolean
  children: ReactNode
}) {
  return (
    <div className="field" style={full ? { gridColumn: '1 / -1' } : undefined}>
      {label && <label className="field-label">{label}</label>}
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  hint?: string
}) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="switch-track" />
      {(label || hint) && (
        <span>
          {label && <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</span>}
          {hint && <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--muted)' }}>{hint}</span>}
        </span>
      )}
    </label>
  )
}

export function ChipsInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}) {
  const [draft, setDraft] = useState('')
  const add = () => {
    const v = draft.trim()
    if (!v) return
    if (!values.includes(v)) onChange([...values, v])
    setDraft('')
  }
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {values.length > 0 && (
        <div className="chips">
          {values.map((v, i) => (
            <span className="chip" key={`${v}-${i}`}>
              {v}
              <button type="button" className="chip-x" onClick={() => onChange(values.filter((_, j) => j !== i))} aria-label={`Remove ${v}`}>
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        className="input"
        value={draft}
        placeholder={placeholder || 'Type and press Enter…'}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            add()
          }
        }}
        onBlur={add}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Repeating list editor                                              */
/* ------------------------------------------------------------------ */
export function ListEditor<T>({
  items,
  onChange,
  factory,
  addLabel,
  empty,
  label,
  children,
}: {
  items: T[]
  onChange: (next: T[]) => void
  factory: () => T
  addLabel: string
  empty?: string
  label?: (item: T, i: number) => string
  children: (item: T, patch: (p: Partial<T>) => void, index: number) => ReactNode
}) {
  const update = (i: number, p: Partial<T>) => onChange(items.map((it, j) => (j === i ? { ...it, ...p } : it)))
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i))
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = items.slice()
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div>
      {items.length === 0 && <div className="empty">{empty || 'Nothing here yet — add your first entry below.'}</div>}
      {items.map((item, i) => (
        <div className="item" key={i}>
          <div className="item-head">
            <span className="item-num">{label ? label(item, i) : `#${i + 1}`}</span>
            <div className="item-actions">
              <button type="button" className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                <ChevronUp size={15} />
              </button>
              <button type="button" className="icon-btn" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">
                <ChevronDown size={15} />
              </button>
              <button type="button" className="icon-btn danger" onClick={() => remove(i)} aria-label="Remove">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          {children(item, (p) => update(i, p), i)}
        </div>
      ))}
      <button type="button" className="btn" style={{ marginTop: 14 }} onClick={() => onChange([...items, factory()])}>
        <Plus size={16} /> {addLabel}
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Save bar                                                           */
/* ------------------------------------------------------------------ */
export function SaveBar({
  saving,
  status,
  error,
  onSave,
  onReset,
}: {
  saving: boolean
  status: 'idle' | 'ok' | 'err'
  error?: string
  onSave: () => void
  onReset: () => void
}) {
  const message =
    saving
      ? 'Saving…'
      : status === 'ok'
        ? '✓ Saved — changes are live on your portfolio'
        : status === 'err'
          ? error || 'Save failed'
          : 'Changes publish instantly to the live site'
  return (
    <div className="save-bar">
      <span className={`save-status${status === 'ok' ? ' ok' : status === 'err' ? ' err' : ''}`}>{message}</span>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onReset} disabled={saving}>
          <RotateCcw size={15} /> Reset
        </button>
        <button type="button" className="btn btn-dark" onClick={onSave} disabled={saving}>
          {saving ? <Loader2 size={16} className="spin" /> : <Check size={16} />} Save changes
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Loading / error states                                             */
/* ------------------------------------------------------------------ */
export function LoadingState({ rows = 4 }: { rows?: number }) {
  return (
    <div className="card">
      <div className="stack">
        <div className="skeleton" style={{ height: 20, width: 180 }} />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 46 }} />
        ))}
      </div>
    </div>
  )
}

export function ErrorState({ message }: { message?: string }) {
  return <div className="empty" style={{ color: 'var(--danger)', borderColor: '#e2b4b0' }}>{message || 'Failed to load. Check your database connection.'}</div>
}
