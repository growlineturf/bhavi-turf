'use client'

import { useState, useEffect } from 'react'
import { Calendar, RefreshCw } from 'lucide-react'

interface Booking {
  id: string; bookingCode: string; customerName: string; customerPhone: string
  totalAmount: number; advanceAmount: number; status: string
  slot: { startTime: string; endTime: string; sport: string; date: string }
}

export default function TodayPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const today = new Date().toISOString().split('T')[0]

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookings?status=confirmed')
      const all: Booking[] = await res.json()
      setBookings(all.filter(b => b.slot?.date?.startsWith(today)))
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2"><Calendar size={20} /> Today&apos;s Bookings</h1>
          <p className="text-zinc-500 text-sm">{new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold">
          <RefreshCw size={14} />
        </button>
      </div>

      {loading ? <p className="text-zinc-500 text-sm">Loading...</p> : bookings.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">
          <Calendar size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No confirmed bookings today</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bookings.sort((a,b) => a.slot.startTime.localeCompare(b.slot.startTime)).map(b => (
            <div key={b.id} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
              <div className="text-blue-400 font-mono font-bold text-sm w-20 flex-shrink-0">{b.slot.startTime}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white">{b.customerName}</div>
                <div className="text-zinc-500 text-xs">{b.slot.sport} · {b.bookingCode}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-green-400 font-bold text-sm">₹{b.advanceAmount}</div>
                <div className="text-zinc-600 text-xs">of ₹{b.totalAmount}</div>
              </div>
            </div>
          ))}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 flex justify-between">
            <span className="text-zinc-400 font-semibold">Total Advance Collected</span>
            <span className="text-green-400 font-black">₹{bookings.reduce((s,b) => s + Number(b.advanceAmount), 0)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
