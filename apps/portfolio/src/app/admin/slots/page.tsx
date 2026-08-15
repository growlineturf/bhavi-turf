'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Grid3x3, Lock, Unlock, RefreshCw, ChevronDown, ChevronUp,
  Check, X, Zap, AlertCircle, AlertTriangle
} from 'lucide-react'


/* ─── Types ─────────────────────────────────────────────────── */
interface Slot {
  id: string
  startTime: string
  endTime: string
  sport: string
  status: string
  price: number
}

/* ─── Period definitions ─────────────────────────────────────── */
const PERIODS = [
  { key: 'twilight', label: '🌙 Twilight', startHour: 5,  endHour: 7,  defaultPrice: 200 },
  { key: 'morning',  label: '🌅 Morning',  startHour: 8,  endHour: 11, defaultPrice: 300 },
  { key: 'noon',     label: '☀️ Noon',     startHour: 12, endHour: 15, defaultPrice: 250 },
  { key: 'evening',  label: '🌆 Evening',  startHour: 16, endHour: 22, defaultPrice: 400 },
]

const STATUS_STYLE: Record<string, { card: string; badge: string }> = {
  available: { card: 'bg-green-950/40 border-green-800/60', badge: 'text-green-400' },
  booked:    { card: 'bg-blue-950/40  border-blue-800/60',  badge: 'text-blue-400'  },
  pending:   { card: 'bg-amber-950/40 border-amber-800/60', badge: 'text-amber-400' },
  blocked:   { card: 'bg-red-950/40   border-red-800/60',   badge: 'text-red-400'   },
}

// (PriceCell removed — price editing is now double-tap on the slot card)

/* ─── Bulk Pricing Panel ─────────────────────────────────────── */
function BulkPricingPanel({
  date, sport, onApplied,
}: {
  date: string; sport: string; onApplied: () => void
}) {
  const [open, setOpen] = useState(true)
  const [prices, setPrices] = useState<Record<string, string>>(() =>
    Object.fromEntries(PERIODS.map(p => [p.key, String(p.defaultPrice)]))
  )
  const [applying, setApplying] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const applyPeriod = async (period: typeof PERIODS[0]) => {
    const price = Number(prices[period.key])
    if (!price || price <= 0) return
    setApplying(period.key)
    setFeedback(null)
    const res = await fetch('/api/slots', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, sport, startHour: period.startHour, endHour: period.endHour, price }),
    })
    const data = await res.json()
    setApplying(null)
    setFeedback(`✓ ${data.updated ?? 0} slots updated`)
    onApplied()
    setTimeout(() => setFeedback(null), 3000)
  }

  const applyAll = async () => {
    setFeedback(null)
    let total = 0
    for (const p of PERIODS) {
      const price = Number(prices[p.key])
      if (!price || price <= 0) continue
      setApplying(p.key)
      const res = await fetch('/api/slots', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, sport, startHour: p.startHour, endHour: p.endHour, price }),
      })
      const data = await res.json()
      total += data.updated ?? 0
    }
    setApplying(null)
    setFeedback(`✓ ${total} slots updated across all periods`)
    onApplied()
    setTimeout(() => setFeedback(null), 4000)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-zinc-800/40 transition"
      >
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          <span className="font-bold text-sm text-white">Quick Bulk Pricing</span>
          <span className="text-[10px] text-zinc-500 font-normal">— set price for a whole time period at once</span>
        </div>
        {open ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-3 border-t border-zinc-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
            {PERIODS.map(p => (
              <div key={p.key} className="flex items-center gap-2 bg-zinc-800/50 rounded-xl px-3 py-2.5">
                <span className="text-xs font-semibold text-zinc-300 w-24 shrink-0">{p.label}</span>
                <span className="text-[10px] text-zinc-600 shrink-0">
                  {p.startHour}:00–{p.endHour}:30
                </span>
                <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden ml-auto">
                  <span className="pl-2 text-xs text-zinc-500">₹</span>
                  <input
                    type="number"
                    min={0}
                    value={prices[p.key]}
                    onChange={e => setPrices(prev => ({ ...prev, [p.key]: e.target.value }))}
                    className="w-16 bg-transparent px-2 py-1.5 text-sm text-white focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => applyPeriod(p)}
                  disabled={applying === p.key}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shrink-0"
                >
                  {applying === p.key
                    ? <RefreshCw size={11} className="animate-spin" />
                    : <Check size={11} />
                  }
                  Apply
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            {feedback
              ? <span className="text-xs text-emerald-400 font-semibold">{feedback}</span>
              : <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                  <AlertCircle size={10} />Booked slots are never overwritten
                </span>
            }
            <button
              onClick={applyAll}
              disabled={!!applying}
              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              <Zap size={12} />
              Apply All Periods
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function SlotManagerPage() {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing]         = useState<string | null>(null)
  const [resetting, setResetting]   = useState(false)
  const [resetMsg, setResetMsg]     = useState('')
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null)
  const [editingPrice, setEditingPrice]   = useState('')
  const lastTapRef = useRef<Map<string, number>>(new Map())
  const priceInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingSlotId) priceInputRef.current?.focus()
  }, [editingSlotId])

  // Single tap = toggle block/unblock | Double tap = edit price
  const handleCardTap = useCallback((slot: Slot) => {
    const now = Date.now()
    const last = lastTapRef.current.get(slot.id) ?? 0
    lastTapRef.current.set(slot.id, now)

    if (now - last < 350) {
      // Double tap → open price editor
      if (slot.status !== 'booked' && slot.status !== 'pending') {
        setEditingSlotId(slot.id)
        setEditingPrice(String(Math.round(Number(slot.price))))
      }
    } else {
      // Single tap
      if (slot.status === 'booked') {
        // Confirm before releasing a booked slot
        if (confirm(`Release ${slot.startTime} slot back to available? This will remove any associated booking.`)) {
          releaseBookedSlot(slot)
        }
      } else if (slot.status !== 'pending') {
        toggleStatus(slot)
      }
    }
  }, []) // toggleStatus is stable

  const commitPrice = async (slot: Slot) => {
    const n = Number(editingPrice)
    if (!n || n <= 0) { setEditingSlotId(null); return }
    await savePrice(slot.id, n)
    setEditingSlotId(null)
  }

  const releaseStuck = async () => {
    if (!confirm(`Release all pending/blocked slots for ${date} (${sport})?`)) return
    setResetting(true)
    const res = await fetch('/api/slots', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, sport }),
    })
    const data = await res.json()
    setResetMsg(`✓ ${data.reset ?? 0} slots released`)
    setTimeout(() => setResetMsg(''), 4000)
    setResetting(false)
    load(date)
  }


  const [sport, setSport] = useState<'Cricket' | 'Football'>('Cricket')

  const load = async (d = date) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/slots?date=${d}`)
      setSlots(await res.json())
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [date])

  /* Release a booked slot (stuck or cancelled) back to available */
  const releaseBookedSlot = async (slot: Slot) => {
    setActing(slot.id)
    await fetch('/api/slots', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: slot.id, status: 'available' }),
    })
    setSlots(p => p.map(s => s.id === slot.id ? { ...s, status: 'available' } : s))
    setActing(null)
  }

  /* Toggle status */
  const toggleStatus = async (slot: Slot) => {
    if (slot.status === 'booked' || slot.status === 'pending') return
    const newStatus = slot.status === 'blocked' ? 'available' : 'blocked'
    setActing(slot.id)
    await fetch('/api/slots', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: slot.id, status: newStatus }),
    })
    setSlots(p => p.map(s => s.id === slot.id ? { ...s, status: newStatus } : s))
    setActing(null)
  }

  /* Save price for one slot */
  const savePrice = async (id: string, price: number) => {
    await fetch('/api/slots', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, price }),
    })
    setSlots(p => p.map(s => s.id === id ? { ...s, price } : s))
  }

  const filtered = slots.filter(s => s.sport === sport)

  /* Group by PERIOD for a cleaner display */
  const getHour = (t: string) => parseInt(t.split(':')[0])
  const grouped = PERIODS.map(p => ({
    ...p,
    slots: filtered.filter(s => getHour(s.startTime) >= p.startHour && getHour(s.startTime) <= p.endHour),
  }))

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Grid3x3 size={20} className="text-blue-400" />
          Slot Manager
        </h1>
        <div className="flex items-center gap-2">
          {resetMsg && <span className="text-xs text-emerald-400 font-semibold">{resetMsg}</span>}
          <button
            onClick={releaseStuck}
            disabled={resetting}
            title="Release all pending/blocked slots back to available"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-900/40 border border-amber-800/60 hover:bg-amber-900/70 text-amber-400 text-xs font-semibold transition disabled:opacity-50"
          >
            {resetting ? <RefreshCw size={13} className="animate-spin" /> : <AlertTriangle size={13} />}
            Release Stuck
          </button>
          <button
            onClick={() => load()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>


      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Date</label>
          <input
            type="date" value={date}
            onChange={e => setDate(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Sport</label>
          <div className="flex gap-2">
            {(['Cricket', 'Football'] as const).map(s => (
              <button key={s} onClick={() => setSport(s)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition ${sport === s ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
                {s === 'Cricket' ? '🏏' : '⚽'} {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Status legend ── */}
      <div className="flex gap-2 flex-wrap text-[10px]">
        {Object.entries(STATUS_STYLE).map(([s, c]) => (
          <span key={s} className={`px-2.5 py-1 rounded-full border ${c.card} ${c.badge} capitalize font-bold`}>{s}</span>
        ))}
        <span className="text-zinc-600 self-center ml-2">Click ₹ price to edit inline · Click slot to block/unblock</span>
      </div>

      {/* ── Bulk Pricing Panel ── */}
      <BulkPricingPanel date={date} sport={sport} onApplied={() => load(date)} />

      {/* ── Slot grid grouped by period ── */}
      {loading ? (
        <div className="flex items-center gap-3 py-12 justify-center text-zinc-500 text-sm">
          <RefreshCw size={16} className="animate-spin" /> Loading slots…
        </div>
      ) : (
        <div className="space-y-5">
          {grouped.map(group => (
            group.slots.length === 0 ? null : (
              <div key={group.key}>
                {/* Period header */}
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="text-xs font-bold text-zinc-400">{group.label}</span>
                  <div className="flex-1 h-px bg-zinc-800" />
                  <span className="text-[10px] text-zinc-600">
                    {group.slots.length} slots · avg ₹{Math.round(group.slots.reduce((s, sl) => s + Number(sl.price), 0) / group.slots.length)}
                  </span>
                </div>

                {/* Slot cards */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                  {group.slots.map(slot => {
                    const style = STATUS_STYLE[slot.status] ?? STATUS_STYLE.available
                    const isEditingThis = editingSlotId === slot.id
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => handleCardTap(slot)}
                        className={`relative w-full p-2.5 rounded-xl border text-left transition active:scale-95 select-none ${style.card}`}
                        title={
                          slot.status === 'booked'  ? 'Tap to release this slot back to available' :
                          slot.status === 'pending' ? 'Pending payment' :
                          slot.status === 'blocked' ? 'Tap to unblock · Double-tap to edit price' :
                          'Tap to block · Double-tap to edit price'
                        }
                      >
                        {/* Time */}
                        <div className={`font-black text-xs ${style.badge}`}>{slot.startTime}</div>

                        {/* Price — inline edit on double-tap */}
                        {isEditingThis ? (
                          <div className="flex items-center gap-1 mt-1" onClick={e => e.stopPropagation()}>
                            <span className="text-[10px] text-zinc-500">₹</span>
                            <input
                              ref={priceInputRef}
                              type="number"
                              value={editingPrice}
                              onChange={e => setEditingPrice(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') commitPrice(slot)
                                if (e.key === 'Escape') setEditingSlotId(null)
                              }}
                              onBlur={() => commitPrice(slot)}
                              className="w-14 bg-zinc-800 border border-blue-500 rounded-md px-1.5 py-0.5 text-xs text-white focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={e => { e.stopPropagation(); commitPrice(slot) }}
                              className="text-emerald-400"
                            >
                              <Check size={10} />
                            </button>
                          </div>
                        ) : (
                          <div className="text-xs opacity-70 mt-1">₹{Math.round(Number(slot.price))}</div>
                        )}

                        {/* Status icon */}
                        <div className="absolute top-2 right-2 opacity-50">
                          {acting === slot.id
                            ? <RefreshCw size={10} className="animate-spin" />
                            : slot.status === 'blocked'
                              ? <Unlock size={10} />
                              : slot.status === 'available'
                                ? <Lock size={10} className="opacity-20" />
                                : null
                          }
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-zinc-600">
              <Grid3x3 size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No slots found for this date & sport.</p>
              <p className="text-xs mt-1">Visit the booking page to auto-generate them.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
