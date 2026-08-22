'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Zap } from 'lucide-react'

interface Booking {
  id: string; customerName: string; customerPhone?: string
  totalAmount: number; advanceAmount: number
  groupId?: string
  slot: { startTime: string; endTime: string; sport: string; date: string }
}

interface FiveOverBooking {
  id: string; customerName: string; customerPhone?: string
  bookingDate: string; bookingTime: string
  serviceName: string; price: number; status: string
}

/** Unified row for the table */
interface Row {
  id: string; customerName: string; date: string
  type: string; total: number
}

function dedupeBookings(list: Booking[]): Booking[] {
  const sorted = [...list].sort((a, b) => {
    const da = a.slot?.date ?? '', db = b.slot?.date ?? ''
    if (da !== db) return da.localeCompare(db)
    return (a.slot?.startTime ?? '').localeCompare(b.slot?.startTime ?? '')
  })
  const seenGroupIds = new Set<string>()
  const result: Booking[] = []
  for (const b of sorted) {
    if (b.groupId) {
      if (!seenGroupIds.has(b.groupId)) { seenGroupIds.add(b.groupId); result.push(b) }
    } else {
      const last = result[result.length - 1]
      if (last && !last.groupId && last.customerName === b.customerName &&
          (last.customerPhone ?? '') === (b.customerPhone ?? '') &&
          last.slot?.date === b.slot?.date && last.slot?.endTime === b.slot?.startTime) {
        result[result.length - 1] = { ...last, slot: { ...last.slot, endTime: b.slot.endTime } }
      } else { result.push(b) }
    }
  }
  return result
}

export default function RevenuePage() {
  const [rows, setRows]           = useState<Row[]>([])
  const [from, setFrom]           = useState(() => new Date(Date.now() - 7*86400000).toISOString().split('T')[0])
  const [to, setTo]               = useState(() => new Date().toISOString().split('T')[0])
  const [loading, setLoading]     = useState(true)
  const [exporting, setExporting] = useState(false)
  const [deleting, setDeleting]   = useState(false)

  /* ── Permanently delete ALL confirmed bookings from DB ── */
  const permanentDelete = async () => {
    const first = confirm('⚠️ PERMANENTLY DELETE all booking history?\n\nThis will remove ALL confirmed bookings and 5-over records from the database. This CANNOT be undone.')
    if (!first) return
    const second = confirm('Are you 100% sure? This is IRREVERSIBLE.')
    if (!second) return

    setDeleting(true)
    try {
      const res = await fetch('/api/revenue/clear', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: 'PERMANENTLY_DELETE' }),
      })
      if (!res.ok) throw new Error('Failed')
      setRows([])
      alert('✅ All booking history permanently deleted.')
    } catch {
      alert('❌ Delete failed. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  /* ── Download full history as proper Excel (.xlsx) ── */
  const downloadExcel = async () => {
    setExporting(true)
    try {
      const XLSX = await import('xlsx')

      const [allNormal, allFive]: [Booking[], FiveOverBooking[]] = await Promise.all([
        fetch('/api/bookings?status=confirmed').then(r => r.json()).catch(() => []),
        fetch('/api/bookings/fiveover').then(r => r.json()).catch(() => []),
      ])

      const normalRows = dedupeBookings(Array.isArray(allNormal) ? allNormal : []).map(b => ({
        'Date':         b.slot?.date?.split('T')[0] ?? '',
        'Customer':     b.customerName ?? '',
        'Phone':        b.customerPhone ?? '',
        'Type':         'Cricket',
        'Time / Slot':  `${b.slot?.startTime ?? ''} – ${b.slot?.endTime ?? ''}`,
        'Amount (₹)':  Number(b.totalAmount),
        'Status':       'Confirmed',
      }))

      const fiveRows = (Array.isArray(allFive) ? allFive : []).map(b => ({
        'Date':         b.bookingDate ?? '',
        'Customer':     b.customerName ?? '',
        'Phone':        b.customerPhone ?? '',
        'Type':         '5 Over – 30 Balls',
        'Time / Slot':  b.bookingTime ?? '',
        'Amount (₹)':  Number(b.price),
        'Status':       b.status === 'confirmed' ? 'Confirmed'
                      : b.status === 'cancelled' ? 'Cancelled' : 'Pending',
      }))

      const combined = [...normalRows, ...fiveRows]
        .sort((a, b) => b['Date'].localeCompare(a['Date']))

      // Build worksheet from JSON
      const ws = XLSX.utils.json_to_sheet(combined)

      // Column widths (in characters)
      ws['!cols'] = [
        { wch: 14 }, // Date
        { wch: 22 }, // Customer
        { wch: 16 }, // Phone
        { wch: 24 }, // Type
        { wch: 22 }, // Time / Slot
        { wch: 14 }, // Amount
        { wch: 12 }, // Status
      ]

      // Freeze top header row
      ws['!freeze'] = { xSplit: 0, ySplit: 1 }

      // Create workbook and add sheet
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'BHAVI TURF Bookings')

      // Write and trigger download
      XLSX.writeFile(wb, `BHAVI-TURF-Bookings-${new Date().toISOString().split('T')[0]}.xlsx`)
    } finally { setExporting(false) }
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch('/api/bookings?status=confirmed').then(r => r.json()).catch(() => []),
      fetch('/api/bookings/fiveover').then(r => r.json()).catch(() => []),
    ]).then(([normal, allFive]: [Booking[], FiveOverBooking[]]) => {
      // Normal confirmed slot bookings filtered by date range
      const filteredNormal = dedupeBookings(
        (Array.isArray(normal) ? normal : []).filter(b => {
          const d = b.slot?.date?.split('T')[0]
          return d >= from && d <= to
        })
      ).map(b => ({
        id: b.id,
        customerName: b.customerName,
        date: b.slot?.date,
        type: `Cricket`,
        total: Number(b.totalAmount),
      }))

      // 5-over confirmed bookings filtered by date range
      const filteredFive = (Array.isArray(allFive) ? allFive : [])
        .filter(b => b.status === 'confirmed' && b.bookingDate >= from && b.bookingDate <= to)
        .map(b => ({
          id: b.id,
          customerName: b.customerName,
          date: b.bookingDate,
          type: '5 Over – 30 Balls',
          total: Number(b.price),
        }))

      // Merge and sort by date descending
      const combined = [...filteredNormal, ...filteredFive]
        .sort((a, b) => b.date.localeCompare(a.date))

      setRows(combined)
      setLoading(false)
    })
  }, [from, to])

  const totalRevenue = rows.reduce((s, r) => s + r.total, 0)
  const totalBookings = rows.length

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2"><BarChart3 size={20} /> Revenue</h1>
          <p className="text-zinc-500 text-xs mt-0.5">Only confirmed bookings · Cancelled bookings are excluded automatically</p>
        </div>
        <button
          onClick={downloadExcel}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-bold transition"
        >
          {exporting ? '⏳ Exporting…' : '⬇ Download Excel'}
        </button>
      </div>

      {/* Date range + Permanent Delete */}
      <div className="flex gap-3 flex-wrap items-end">
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
        <button
          onClick={() => { setFrom('2000-01-01'); setTo(new Date().toISOString().split('T')[0]) }}
          className="px-4 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-sm font-semibold transition"
        >
          Show All
        </button>
        {/* Permanent delete — destructive */}
        <button
          onClick={permanentDelete}
          disabled={deleting}
          className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-bold transition flex items-center gap-2"
        >
          {deleting ? '⏳ Deleting…' : '🗑 Delete All Records'}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Total Revenue</p>
          <p className="text-3xl font-black text-green-400">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Confirmed Bookings</p>
          <p className="text-3xl font-black text-blue-400">{totalBookings}</p>
        </div>
      </div>

      {/* Bookings table */}
      {loading ? <p className="text-zinc-500 text-sm">Loading...</p> : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                {['Customer', 'Date', 'Type', 'Total'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="px-4 py-3 font-semibold text-white">{r.customerName}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-4 py-3">
                    {r.type === '5 Over – 30 Balls' ? (
                      <span className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Zap size={11} /> {r.type}
                      </span>
                    ) : (
                      <span className="text-zinc-400">{r.type}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-green-400 font-bold">₹{r.total.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-zinc-600">No confirmed bookings in this range</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
