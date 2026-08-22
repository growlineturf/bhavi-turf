'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, RefreshCw, Phone, MessageSquare, Zap } from 'lucide-react'

interface Slot { id: string; date: string; startTime: string; endTime: string; sport: string; pendingExpiresAt?: string }
interface Booking {
  id: string; customerName: string; customerPhone: string
  totalAmount: number; advanceAmount: number; gpayNumber: string
  status: string; createdAt: string; slot: Slot
}

interface FiveOverBooking {
  id: string; customerName: string; customerPhone: string
  bookingDate: string; bookingTime: string
  serviceName: string; price: number; status: string; createdAt: string
}

/* Group consecutive slots from same customer into one request */
interface BookingGroup {
  ids: string[]
  primary: Booking
  startTime: string
  endTime: string
}

function groupBookings(list: Booking[]): BookingGroup[] {
  const sorted = [...list].sort((a, b) => {
    const dateA = a.slot?.date ?? ''
    const dateB = b.slot?.date ?? ''
    if (dateA !== dateB) return dateA.localeCompare(dateB)
    return (a.slot?.startTime ?? '').localeCompare(b.slot?.startTime ?? '')
  })

  const groups: BookingGroup[] = []
  for (const b of sorted) {
    const last = groups[groups.length - 1]
    if (
      last &&
      last.primary.customerPhone === b.customerPhone &&
      last.primary.slot?.date === b.slot?.date &&
      last.endTime === b.slot?.startTime
    ) {
      last.ids.push(b.id)
      last.endTime = b.slot?.endTime ?? last.endTime
    } else {
      groups.push({
        ids: [b.id],
        primary: b,
        startTime: b.slot?.startTime ?? '',
        endTime: b.slot?.endTime ?? '',
      })
    }
  }
  return groups
}

function Countdown({ expiresAt }: { expiresAt?: string }) {
  const [secs, setSecs] = useState(0)
  useEffect(() => {
    if (!expiresAt) return
    const tick = () => setSecs(Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)))
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [expiresAt])
  if (!expiresAt) return null
  const m = Math.floor(secs / 60), s = secs % 60
  return <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${secs < 120 ? 'bg-red-900/40 text-red-400' : 'bg-zinc-800 text-zinc-400'}`}>⏱ {m}:{String(s).padStart(2,'0')}</span>
}

export default function AdminPendingPage() {
  const [bookings, setBookings]       = useState<Booking[]>([])
  const [fiveOver, setFiveOver]       = useState<FiveOverBooking[]>([])
  const [loading, setLoading]         = useState(true)
  const [acting, setActing]           = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const [res, fiveRes] = await Promise.all([
        fetch('/api/bookings?status=pending_payment'),
        fetch('/api/bookings/fiveover'),
      ])
      const normal: Booking[]         = res.ok     ? await res.json()     : []
      const allFive: FiveOverBooking[] = fiveRes.ok ? await fiveRes.json() : []
      setBookings(Array.isArray(normal) ? normal : [])
      setFiveOver(Array.isArray(allFive) ? allFive.filter(b => b.status === 'pending_payment') : [])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { const iv = setInterval(load, 15000); return () => clearInterval(iv) }, [load])

  if (loading) return <div className="text-zinc-500 text-sm pt-8 text-center">Loading pending bookings...</div>

  /* Act on ALL IDs in the group (confirm/reject every slot together) */
  const act = async (ids: string[], status: 'confirmed' | 'cancelled') => {
    setActing(ids[0])
    await Promise.all(ids.map(id =>
      fetch('/api/bookings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    ))
    setBookings(p => p.filter(b => !ids.includes(b.id)))
    setActing(null)
    window.dispatchEvent(new Event('bookingActioned'))
  }

  /* Confirm or reject a 5-over booking */
  const actFiveOver = async (id: string, status: 'confirmed' | 'cancelled') => {
    setActing(id)
    await fetch('/api/bookings/fiveover', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setFiveOver(p => p.filter(b => b.id !== id))
    setActing(null)
    window.dispatchEvent(new Event('bookingActioned'))
  }

  const waLink = (phone: string) => `https://wa.me/91${phone.replace(/\D/g,'').slice(-10)}`

  const groups = groupBookings(bookings)

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Pending Confirmations</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Confirm only after verifying payment on WhatsApp</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold transition">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ── Normal slot bookings ── */}
      {groups.length === 0 && fiveOver.length === 0 && (
        <div className="text-center py-20 text-zinc-600">
          <CheckCircle size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No pending bookings</p>
          <p className="text-sm mt-1">New bookings will appear here automatically</p>
        </div>
      )}

      <div className="space-y-3">
        {groups.map(g => {
          const { primary, ids, startTime, endTime } = g
          const isActing = acting === ids[0]
          return (
            <div key={ids[0]} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <Countdown expiresAt={primary.slot?.pendingExpiresAt} />
                  {ids.length > 1 && (
                    <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                      {ids.length} slots
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-500">{new Date(primary.createdAt).toLocaleString('en-IN')}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Customer</p>
                  <p className="font-bold text-white">{primary.customerName}</p>
                  <a href={`tel:${primary.customerPhone}`} className="flex items-center gap-1 text-blue-400 text-sm mt-0.5 hover:underline">
                    <Phone size={11} /> {primary.customerPhone}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Slot</p>
                  <p className="font-bold text-white">{startTime} – {endTime}</p>
                  <p className="text-zinc-400 text-sm">
                    {primary.slot?.sport} · {new Date(primary.slot?.date).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Payment</p>
                  <p className="font-bold text-green-400">₹{primary.advanceAmount} advance</p>
                  <p className="text-zinc-400 text-sm">Total ₹{primary.totalAmount}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">GPay No.</p>
                  <p className="font-mono text-white text-sm">{primary.gpayNumber}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-3 border-t border-zinc-800">
                <a href={waLink(primary.customerPhone)} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-bold transition">
                  <MessageSquare size={14} /> Check on WhatsApp
                </a>
                <button onClick={() => act(ids, 'confirmed')} disabled={isActing}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold transition">
                  <CheckCircle size={14} /> Confirm Booking
                </button>
                <button onClick={() => act(ids, 'cancelled')} disabled={isActing}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-red-900/40 hover:text-red-400 text-zinc-400 text-sm font-semibold transition">
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── 5-Over Pending Bookings ── */}
      {fiveOver.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-amber-400" />
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              5 Over – 30 Balls Pending ({fiveOver.length})
            </p>
          </div>
          {fiveOver.map(b => (
            <div key={b.id} className="bg-zinc-900 border border-amber-800/30 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap size={13} className="text-amber-400" />
                  <span className="text-xs font-bold text-amber-400">{b.serviceName}</span>
                </div>
                <span className="text-xs text-zinc-500">{new Date(b.createdAt).toLocaleString('en-IN')}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Customer</p>
                  <p className="font-bold text-white">{b.customerName}</p>
                  <a href={`tel:${b.customerPhone}`} className="flex items-center gap-1 text-blue-400 text-sm mt-0.5 hover:underline">
                    <Phone size={11} /> {b.customerPhone}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Date</p>
                  <p className="font-bold text-white">{new Date(b.bookingDate).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Time</p>
                  <p className="font-bold text-white">{b.bookingTime}</p>
                  <p className="text-zinc-400 text-sm">30 Balls</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Amount</p>
                  <p className="font-bold text-green-400">₹{b.price}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-3 border-t border-zinc-800">
                <a href={waLink(b.customerPhone)} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-bold transition">
                  <MessageSquare size={14} /> Check on WhatsApp
                </a>
                <button onClick={() => actFiveOver(b.id, 'confirmed')} disabled={acting === b.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold transition">
                  <CheckCircle size={14} /> {acting === b.id ? 'Confirming…' : 'Confirm Booking'}
                </button>
                <button onClick={() => actFiveOver(b.id, 'cancelled')} disabled={acting === b.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-red-900/40 hover:text-red-400 text-zinc-400 text-sm font-semibold transition">
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
