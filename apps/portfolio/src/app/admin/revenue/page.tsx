'use client'

import { useState, useEffect } from 'react'
import { BarChart3 } from 'lucide-react'

interface Booking {
  id: string; customerName: string; totalAmount: number; advanceAmount: number
  confirmedAt: string; slot: { startTime: string; sport: string; date: string }
}

export default function RevenuePage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [from, setFrom] = useState(() => new Date(Date.now() - 7*86400000).toISOString().split('T')[0])
  const [to, setTo] = useState(() => new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('/api/bookings?status=confirmed')
      .then(r => r.json())
      .then((all: Booking[]) => {
        setBookings(all.filter(b => {
          const d = b.slot?.date?.split('T')[0]
          return d >= from && d <= to
        }))
        setLoading(false)
      })
  }, [from, to])

  const totalAdv = bookings.reduce((s,b) => s + Number(b.advanceAmount), 0)
  const totalFull = bookings.reduce((s,b) => s + Number(b.totalAmount), 0)
  const totalRemaining = totalFull - totalAdv

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <h1 className="text-xl font-black text-white flex items-center gap-2"><BarChart3 size={20} /> Revenue</h1>

      <div className="flex gap-3 flex-wrap">
        <div>
          <label className="text-xs text-zinc-500 block mb-1">From</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">To</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Advance Collected', value: totalAdv, color: 'text-green-400' },
          { label: 'Total Value', value: totalFull, color: 'text-blue-400' },
          { label: 'Remaining Due', value: totalRemaining, color: 'text-yellow-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
            <p className={`text-2xl font-black ${color}`}>₹{value.toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>

      {loading ? <p className="text-zinc-500 text-sm">Loading...</p> : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                {['Customer','Date','Sport','Advance','Total'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="px-4 py-3 font-semibold text-white">{b.customerName}</td>
                  <td className="px-4 py-3 text-zinc-400">{new Date(b.slot?.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
                  <td className="px-4 py-3 text-zinc-400">{b.slot?.sport}</td>
                  <td className="px-4 py-3 text-green-400 font-bold">₹{b.advanceAmount}</td>
                  <td className="px-4 py-3 text-zinc-300">₹{b.totalAmount}</td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-zinc-600">No confirmed bookings in this range</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
