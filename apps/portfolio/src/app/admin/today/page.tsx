'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar, RefreshCw, Phone, XCircle, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'

interface Booking {
  id: string; customerName: string; customerPhone: string
  totalAmount: number; advanceAmount: number; status: string
  slot: { startTime: string; endTime: string; sport: string; date: string }
}

/* Merge consecutive slots from the same customer into one group */
interface BookingGroup {
  ids: string[]           // all booking IDs in this group
  primary: Booking        // first booking (for customer info)
  startTime: string       // earliest slot startTime
  endTime: string         // latest slot endTime
  status: string
}

function groupBookings(list: Booking[]): BookingGroup[] {
  const sorted = [...list].sort((a, b) => a.slot.startTime.localeCompare(b.slot.startTime))
  const groups: BookingGroup[] = []
  for (const b of sorted) {
    const last = groups[groups.length - 1]
    if (
      last &&
      last.primary.customerPhone === b.customerPhone &&
      last.status === b.status &&
      last.endTime === b.slot.startTime   // slots are consecutive
    ) {
      last.ids.push(b.id)
      last.endTime = b.slot.endTime
    } else {
      groups.push({ ids: [b.id], primary: b, startTime: b.slot.startTime, endTime: b.slot.endTime, status: b.status })
    }
  }
  return groups
}

/* Generate today + next 7 days */
function getDates() {
  const base = new Date(); base.setHours(0,0,0,0)
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return Array.from({ length: 8 }, (_, i) => {
    const d = new Date(base); d.setDate(base.getDate() + i)
    const y = d.getFullYear()
    const mo = String(d.getMonth()+1).padStart(2,'0')
    const dd = String(d.getDate()).padStart(2,'0')
    return {
      dateStr: `${y}-${mo}-${dd}`,
      label: i === 0 ? 'Today' : days[d.getDay()],
      sub: `${d.getDate()} ${months[d.getMonth()]}`,
      full: d.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' }),
    }
  })
}

export default function TodayPage() {
  const DATES = getDates()
  const [selDate, setSelDate]         = useState(DATES[0].dateStr)
  const [bookings, setBookings]       = useState<Booking[]>([])
  const [loading, setLoading]         = useState(true)
  const [cancelling, setCancelling]   = useState<string | null>(null)
  const [confirming, setConfirming]   = useState<string | null>(null)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const dateInfo = DATES.find(d => d.dateStr === selDate) ?? DATES[0]
  const dateIdx  = DATES.findIndex(d => d.dateStr === selDate)

  const load = useCallback(async (date: string) => {
    setLoading(true)
    try {
      // Fetch all statuses so we see pending + confirmed
      const [confRes, pendRes] = await Promise.all([
        fetch('/api/bookings?status=confirmed'),
        fetch('/api/bookings?status=pending_payment'),
      ])
      const conf: Booking[] = confRes.ok ? await confRes.json() : []
      const pend: Booking[] = pendRes.ok ? await pendRes.json() : []
      const all = [...conf, ...pend]
      setBookings(all.filter(b => b.slot?.date?.startsWith(date)))
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load(selDate) }, [selDate, load])
  useEffect(() => { const iv = setInterval(() => load(selDate), 15000); return () => clearInterval(iv) }, [selDate, load])

  const cancelBooking = async (ids: string[]) => {
    setCancelling(ids[0])
    try {
      // Cancel ALL slots in the group
      await Promise.all(ids.map(id =>
        fetch('/api/bookings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status: 'cancelled' }),
        })
      ))
      setBookings(p => p.filter(b => !ids.includes(b.id)))
    } finally { setCancelling(null); setConfirming(null) }
  }

  const confirmBooking = async (id: string) => {
    setConfirmingId(id)
    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'confirmed' }),
      })
      setBookings(p => p.map(b => b.id === id ? { ...b, status: 'confirmed' } : b))
    } finally { setConfirmingId(null) }
  }

  const fmt = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h < 12 ? 'AM' : 'PM'}`
  }

  const confirmed = groupBookings(bookings.filter(b => b.status === 'confirmed'))
  const pending   = groupBookings(bookings.filter(b => b.status === 'pending_payment'))

  return (
    <div className="space-y-5 max-w-3xl mx-auto">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Calendar size={20} /> Bookings
          </h1>
          <p className="text-zinc-500 text-sm">{dateInfo.full}</p>
        </div>
        <button onClick={() => load(selDate)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold transition">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ── Date Strip ───────────────────────────────────────── */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => dateIdx > 0 && setSelDate(DATES[dateIdx - 1].dateStr)}
          disabled={dateIdx <= 0}
          className="h-9 w-9 flex items-center justify-center rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 disabled:opacity-20 transition shrink-0">
          <ChevronLeft size={18} />
        </button>

        <div className="flex gap-2 overflow-x-auto flex-1 px-1" style={{ scrollbarWidth:'none' }}>
          {DATES.map(d => {
            const active = d.dateStr === selDate
            return (
              <button key={d.dateStr} onClick={() => setSelDate(d.dateStr)}
                className={`flex-shrink-0 flex flex-col items-center justify-center rounded-xl px-3 py-2 min-w-[62px] transition-all ${
                  active ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-blue-400' : 'text-zinc-600'}`}>
                  {d.label}
                </span>
                <span className={`text-sm font-black leading-tight mt-0.5 ${active ? 'text-white' : 'text-zinc-400'}`}>
                  {d.sub}
                </span>
              </button>
            )
          })}
        </div>

        <button
          onClick={() => dateIdx < DATES.length - 1 && setSelDate(DATES[dateIdx + 1].dateStr)}
          disabled={dateIdx >= DATES.length - 1}
          className="h-9 w-9 flex items-center justify-center rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 disabled:opacity-20 transition shrink-0">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      {loading ? (
        <p className="text-zinc-500 text-sm">Loading...</p>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">
          <Calendar size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No bookings for {dateInfo.label === 'Today' ? 'today' : dateInfo.sub}</p>
        </div>
      ) : (
        <div className="space-y-3">

          {/* Pending first */}
          {pending.length > 0 && (
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest px-1">
              ⏳ Pending ({pending.length})
            </p>
          )}
          {pending.map(g => (
            <BookingCard key={g.ids[0]} g={g} fmt={fmt}
              cancelling={cancelling} confirming={confirming}
              confirmingId={confirmingId}
              onCancel={() => setConfirming(g.ids[0])}
              onCancelConfirm={() => cancelBooking(g.ids)}
              onCancelAbort={() => setConfirming(null)}
              onConfirm={() => confirmBooking(g.ids[0])}
            />
          ))}

          {/* Confirmed */}
          {confirmed.length > 0 && (
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest px-1 pt-1">
              ✓ Confirmed ({confirmed.length})
            </p>
          )}
          {confirmed.map(g => (
            <BookingCard key={g.ids[0]} g={g} fmt={fmt}
              cancelling={cancelling} confirming={confirming}
              confirmingId={confirmingId}
              onCancel={() => setConfirming(g.ids[0])}
              onCancelConfirm={() => cancelBooking(g.ids)}
              onCancelAbort={() => setConfirming(null)}
              onConfirm={() => confirmBooking(g.ids[0])}
            />
          ))}

          {/* Summary */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 flex justify-between items-center">
            <div>
              <p className="text-zinc-400 font-semibold text-sm">Total Advance Collected</p>
              <p className="text-zinc-500 text-xs">
                {confirmed.length} confirmed · {pending.length} pending
              </p>
            </div>
            <span className="text-green-400 font-black text-lg">
              ₹{confirmed.reduce((s, b) => s + Number(b.advanceAmount), 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Booking Card ────────────────────────────────────────────── */
function BookingCard({ g, fmt, cancelling, confirming, confirmingId, onCancel, onCancelConfirm, onCancelAbort, onConfirm }: {
  g: BookingGroup; fmt: (t: string) => string
  cancelling: string | null; confirming: string | null; confirmingId: string | null
  onCancel: () => void; onCancelConfirm: () => void; onCancelAbort: () => void
  onConfirm: () => void
}) {
  const { primary, startTime, endTime, ids } = g
  const isPending    = primary.status === 'pending_payment'
  const isCancelling = cancelling === ids[0]
  const isConfirming = confirmingId === ids[0]
  const timeLabel    = `${fmt(startTime)} – ${fmt(endTime)}`

  return (
    <div className={`bg-zinc-900 border rounded-2xl p-4 space-y-3 ${isPending ? 'border-amber-800/50' : 'border-zinc-800'}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
          isPending ? 'text-amber-400 bg-amber-900/30' : 'text-emerald-400 bg-emerald-900/30'
        }`}>
          {isPending ? '⏳ Pending' : '✓ Confirmed'}
        </span>
        {ids.length > 1 && (
          <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
            {ids.length} slots
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">Customer</p>
          <p className="font-bold text-white text-sm">{primary.customerName}</p>
          <a href={`tel:${primary.customerPhone}`} className="flex items-center gap-1 text-blue-400 text-xs hover:underline mt-0.5">
            <Phone size={10} /> {primary.customerPhone}
          </a>
        </div>
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">Time</p>
          <p className="font-bold text-white text-sm leading-tight">{timeLabel}</p>
          <p className="text-zinc-400 text-xs">{primary.slot.sport}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">Advance</p>
          <p className="font-bold text-green-400 text-sm">₹{primary.advanceAmount}</p>
          <p className="text-zinc-500 text-xs">of ₹{primary.totalAmount}</p>
        </div>
      </div>

      {/* Confirm pending */}
      {isPending && (
        <button onClick={onConfirm} disabled={isConfirming}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold transition">
          <CheckCircle size={13} />
          {isConfirming ? 'Confirming...' : 'Confirm Booking'}
        </button>
      )}

      {/* Cancel */}
      {confirming === ids[0] ? (
        <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={14} />
            <span className="text-sm font-bold">Cancel this booking?</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            This will cancel <strong className="text-white">{primary.customerName}</strong>&apos;s{' '}
            {ids.length > 1 ? `${ids.length} slots` : 'slot'} at{' '}
            <strong className="text-white">{timeLabel}</strong> and make them available again.
          </p>
          <div className="flex gap-2 pt-1">
            <button onClick={onCancelConfirm} disabled={isCancelling}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-bold transition">
              <XCircle size={14} />
              {isCancelling ? 'Cancelling...' : 'Yes, Cancel & Free Slot'}
            </button>
            <button onClick={onCancelAbort} disabled={isCancelling}
              className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold transition">
              Keep Booking
            </button>
          </div>
        </div>
      ) : (
        <button onClick={onCancel}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-zinc-700 hover:border-red-700 hover:bg-red-950/30 hover:text-red-400 text-zinc-500 text-xs font-semibold transition">
          <XCircle size={13} /> Cancel Booking
        </button>
      )}
    </div>
  )
}
