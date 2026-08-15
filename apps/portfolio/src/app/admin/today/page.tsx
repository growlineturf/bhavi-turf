'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar, RefreshCw, Phone, XCircle, CheckCircle, AlertTriangle } from 'lucide-react'

interface Booking {
  id: string; bookingCode: string; customerName: string; customerPhone: string
  totalAmount: number; advanceAmount: number; status: string
  slot: { startTime: string; endTime: string; sport: string; date: string }
}

export default function TodayPage() {
  const [bookings, setBookings]       = useState<Booking[]>([])
  const [loading, setLoading]         = useState(true)
  const [cancelling, setCancelling]   = useState<string | null>(null)   // booking id being cancelled
  const [confirming, setConfirming]   = useState<string | null>(null)   // booking id awaiting confirm
  const today = new Date().toISOString().split('T')[0]

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookings?status=confirmed')
      const all: Booking[] = await res.json()
      setBookings(all.filter(b => b.slot?.date?.startsWith(today)))
    } finally { setLoading(false) }
  }, [today])

  useEffect(() => { load() }, [load])

  const cancel = async (id: string) => {
    setCancelling(id)
    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'cancelled' }),
      })
      setBookings(p => p.filter(b => b.id !== id))
    } finally {
      setCancelling(null)
      setConfirming(null)
    }
  }

  const fmt = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h < 12 ? 'AM' : 'PM'}`
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Calendar size={20} /> Today&apos;s Bookings
          </h1>
          <p className="text-zinc-500 text-sm">
            {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold transition">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-500 text-sm">Loading...</p>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">
          <Calendar size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No confirmed bookings today</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings
            .sort((a, b) => a.slot.startTime.localeCompare(b.slot.startTime))
            .map(b => (
              <div key={b.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-blue-400 font-bold text-sm">{b.bookingCode}</span>
                  <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full font-semibold">
                    ✓ Confirmed
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">Customer</p>
                    <p className="font-bold text-white text-sm">{b.customerName}</p>
                    <a href={`tel:${b.customerPhone}`} className="flex items-center gap-1 text-blue-400 text-xs hover:underline mt-0.5">
                      <Phone size={10} /> {b.customerPhone}
                    </a>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">Time</p>
                    <p className="font-bold text-white text-sm">{fmt(b.slot.startTime)}</p>
                    <p className="text-zinc-400 text-xs">{b.slot.sport}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">Advance</p>
                    <p className="font-bold text-green-400 text-sm">₹{b.advanceAmount}</p>
                    <p className="text-zinc-500 text-xs">of ₹{b.totalAmount}</p>
                  </div>
                </div>

                {/* Cancel section */}
                {confirming === b.id ? (
                  /* Confirmation prompt */
                  <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-3 space-y-2">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertTriangle size={14} />
                      <span className="text-sm font-bold">Cancel this booking?</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      This will cancel <strong className="text-white">{b.customerName}</strong>&apos;s slot at{' '}
                      <strong className="text-white">{fmt(b.slot.startTime)}</strong> and make it available again.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => cancel(b.id)}
                        disabled={cancelling === b.id}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-bold transition"
                      >
                        <XCircle size={14} />
                        {cancelling === b.id ? 'Cancelling...' : 'Yes, Cancel & Free Slot'}
                      </button>
                      <button
                        onClick={() => setConfirming(null)}
                        disabled={cancelling === b.id}
                        className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold transition"
                      >
                        Keep Booking
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirming(b.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-zinc-700 hover:border-red-700 hover:bg-red-950/30 hover:text-red-400 text-zinc-500 text-xs font-semibold transition"
                  >
                    <XCircle size={13} /> Cancel Booking
                  </button>
                )}
              </div>
            ))}

          {/* Summary */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 flex justify-between items-center">
            <div>
              <p className="text-zinc-400 font-semibold text-sm">Total Advance Collected</p>
              <p className="text-zinc-500 text-xs">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} today</p>
            </div>
            <span className="text-green-400 font-black text-lg">
              ₹{bookings.reduce((s, b) => s + Number(b.advanceAmount), 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
