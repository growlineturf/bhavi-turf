'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, RefreshCw, Phone, Clock, MessageSquare } from 'lucide-react'

interface Slot { id: string; date: string; startTime: string; endTime: string; sport: string; pendingExpiresAt?: string }
interface Booking {
  id: string; bookingCode: string; customerName: string; customerPhone: string
  totalAmount: number; advanceAmount: number; gpayNumber: string
  status: string; createdAt: string; slot: Slot
  pendingExpiresAt?: string
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
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/bookings?status=pending_payment')
      setBookings(await res.json())
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { const iv = setInterval(load, 15000); return () => clearInterval(iv) }, [load])

  const act = async (id: string, status: 'confirmed' | 'cancelled') => {
    setActing(id)
    await fetch('/api/bookings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    setBookings(p => p.filter(b => b.id !== id))
    setActing(null)
  }

  const waLink = (b: Booking) => `https://wa.me/91${b.customerPhone.replace(/\D/g,'').slice(-10)}`

  if (loading) return <div className="text-zinc-500 text-sm pt-8 text-center">Loading pending bookings...</div>

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Pending Confirmations</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Confirm only after verifying payment screenshot on WhatsApp</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold transition">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-20 text-zinc-600">
          <CheckCircle size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No pending bookings</p>
          <p className="text-sm mt-1">New bookings will appear here automatically</p>
        </div>
      )}

      <div className="space-y-3">
        {bookings.map(b => (
          <div key={b.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-blue-400 font-bold text-sm">{b.bookingCode}</span>
                <Countdown expiresAt={b.slot?.pendingExpiresAt} />
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
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Slot</p>
                <p className="font-bold text-white">{b.slot?.startTime} – {b.slot?.endTime}</p>
                <p className="text-zinc-400 text-sm">{b.slot?.sport} · {new Date(b.slot?.date).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Payment</p>
                <p className="font-bold text-green-400">₹{b.advanceAmount} advance</p>
                <p className="text-zinc-400 text-sm">Total ₹{b.totalAmount}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">GPay No.</p>
                <p className="font-mono text-white text-sm">{b.gpayNumber}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-3 border-t border-zinc-800">
              <a href={waLink(b)} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-bold transition">
                <MessageSquare size={14} /> Check Screenshot
              </a>
              <button onClick={() => act(b.id, 'confirmed')} disabled={acting === b.id}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold transition">
                <CheckCircle size={14} /> Confirm Booking
              </button>
              <button onClick={() => act(b.id, 'cancelled')} disabled={acting === b.id}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-red-900/40 hover:text-red-400 text-zinc-400 text-sm font-semibold transition">
                <XCircle size={14} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
