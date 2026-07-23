'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'
import { Loader2, Mail, MailOpen, Trash2 } from 'lucide-react'
import { ErrorState, LoadingState, PageHead } from '@/components/editor-kit'

type Message = {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  isRead: boolean
  createdAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/messages')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setMessages(d.data)
        else setError(d.error || 'Failed to load')
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const toggleRead = async (m: Message, isRead: boolean) => {
    setBusy(m.id)
    await fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: m.id, isRead }),
    })
    setMessages((prev) => prev?.map((x) => (x.id === m.id ? { ...x, isRead } : x)) ?? prev)
    setBusy(null)
  }

  const remove = async (m: Message) => {
    if (!confirm(`Delete the message from ${m.name}?`)) return
    setBusy(m.id)
    await fetch(`/api/messages?id=${encodeURIComponent(m.id)}`, { method: 'DELETE' })
    setMessages((prev) => prev?.filter((x) => x.id !== m.id) ?? prev)
    setBusy(null)
  }

  const open = (m: Message) => {
    const next = openId === m.id ? null : m.id
    setOpenId(next)
    if (next && !m.isRead) toggleRead(m, true)
  }

  const fmt = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    } catch {
      return iso
    }
  }

  const unread = messages?.filter((m) => !m.isRead).length ?? 0

  return (
    <div>
      <PageHead
        title="Messages"
        sub={unread > 0 ? `${unread} unread message${unread === 1 ? '' : 's'} from your contact form.` : 'Messages sent through your portfolio contact form.'}
      />

      {loading ? (
        <LoadingState rows={4} />
      ) : error ? (
        <ErrorState message={error} />
      ) : !messages || messages.length === 0 ? (
        <div className="empty">No messages yet. Submissions from your contact form will appear here.</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 40 }} />
                <th>From</th>
                <th>Subject</th>
                <th style={{ width: 170 }}>Received</th>
                <th style={{ width: 90 }} />
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <Fragment key={m.id}>
                  <tr style={{ cursor: 'pointer', fontWeight: m.isRead ? 400 : 600 }} onClick={() => open(m)}>
                    <td>{m.isRead ? <MailOpen size={16} className="muted" /> : <Mail size={16} />}</td>
                    <td>
                      <div>{m.name}</div>
                      <div className="muted" style={{ fontSize: '0.8rem', fontWeight: 400 }}>{m.email}</div>
                    </td>
                    <td>{m.subject || <span className="muted">— no subject —</span>}</td>
                    <td className="muted" style={{ fontWeight: 400 }}>{fmt(m.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="icon-btn" onClick={() => toggleRead(m, !m.isRead)} disabled={busy === m.id} aria-label="Toggle read">
                          {busy === m.id ? <Loader2 size={15} className="spin" /> : m.isRead ? <Mail size={15} /> : <MailOpen size={15} />}
                        </button>
                        <button type="button" className="icon-btn danger" onClick={() => remove(m)} disabled={busy === m.id} aria-label="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {openId === m.id && (
                    <tr>
                      <td colSpan={5} style={{ background: 'var(--paper-2)' }}>
                        <div style={{ padding: '4px 4px 8px', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{m.message}</div>
                        <a href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (m.subject || 'your message'))}`} className="btn btn-sm btn-dark">
                          Reply by email
                        </a>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
