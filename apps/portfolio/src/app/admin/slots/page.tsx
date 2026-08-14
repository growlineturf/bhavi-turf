'use client'

import { useState, useEffect } from 'react'
import { Grid3x3, Lock, Unlock, RefreshCw } from 'lucide-react'

interface Slot {
  id: string; startTime: string; endTime: string; sport: string
  status: string; price: number; pendingExpiresAt?: string
}

const STATUS_COLORS: Record<string, string> = {
  available: 'bg-green-900/30 border-green-800 text-green-400',
  booked: 'bg-blue-900/30 border-blue-800 text-blue-400',
  pending: 'bg-yellow-900/30 border-yellow-800 text-yellow-400',
  blocked: 'bg-red-900/30 border-red-800 text-red-400',
}

export default function SlotManagerPage() {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [sport, setSport] = useState<'Cricket' | 'Football'>('Cricket')

  const load = async (d = date) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/slots?date=${d}`)
      setSlots(await res.json())
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [date])

  const toggle = async (slot: Slot) => {
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

  const filtered = slots.filter(s => s.sport === sport)

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-black text-white flex items-center gap-2"><Grid3x3 size={20} /> Slot Manager</h1>
        <button onClick={() => load()} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold">
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Sport</label>
          <div className="flex gap-2">
            {(['Cricket','Football'] as const).map(s => (
              <button key={s} onClick={() => setSport(s)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition ${sport === s ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 text-xs flex-wrap">
        {Object.entries(STATUS_COLORS).map(([s, c]) => (
          <span key={s} className={`px-2.5 py-1 rounded-full border ${c} capitalize font-semibold`}>{s}</span>
        ))}
      </div>

      {loading ? <p className="text-zinc-500 text-sm">Loading slots...</p> : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {filtered.map(slot => (
            <button key={slot.id} onClick={() => toggle(slot)} disabled={acting === slot.id || slot.status === 'booked'}
              title={slot.status === 'booked' ? 'Already booked — cannot change' : `Click to ${slot.status === 'blocked' ? 'unblock' : 'block'}`}
              className={`relative p-3 rounded-xl border text-left transition ${STATUS_COLORS[slot.status] ?? 'bg-zinc-800 border-zinc-700'} ${slot.status !== 'booked' ? 'hover:opacity-80 cursor-pointer' : 'cursor-default opacity-70'}`}>
              <div className="font-bold text-xs">{slot.startTime}</div>
              <div className="text-xs opacity-70 mt-0.5">₹{slot.price}</div>
              <div className="absolute top-2 right-2">
                {slot.status === 'blocked' ? <Unlock size={11} /> : slot.status === 'available' ? <Lock size={11} className="opacity-40" /> : null}
              </div>
            </button>
          ))}
          {filtered.length === 0 && <p className="col-span-5 text-zinc-600 text-sm py-8 text-center">No slots for this date/sport</p>}
        </div>
      )}
      <p className="text-xs text-zinc-600">Tap any slot to block/unblock it. Booked slots cannot be changed.</p>
    </div>
  )
}
