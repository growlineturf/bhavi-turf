'use client'

import { useAdmin } from '@/lib/adminStore'
import { Trophy, CalendarCheck, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react'

export default function DashboardHome() {
  const { config, bookings } = useAdmin()

  const total = bookings.length
  const confirmed = bookings.filter((b) => b.paymentStatus === 'CONFIRMED').length
  const pending = bookings.filter((b) => b.paymentStatus === 'PENDING_VERIFICATION').length
  const revenue = bookings
    .filter((b) => b.paymentStatus === 'CONFIRMED')
    .reduce((s, b) => s + b.totalAmount, 0)
  const advances = bookings
    .filter((b) => b.paymentStatus !== 'CANCELLED')
    .reduce((s, b) => s + b.advanceAmount, 0)

  const stats = [
    { label: 'Total Bookings', value: total, color: '#3b82f6' },
    { label: 'Confirmed', value: confirmed, color: '#22c55e' },
    { label: 'Pending Verification', value: pending, color: '#f59e0b' },
    { label: 'Total Revenue (₹)', value: `₹${revenue.toLocaleString()}`, color: '#a78bfa' },
    { label: 'Advance Collected (₹)', value: `₹${advances.toLocaleString()}`, color: '#34d399' },
    { label: 'Evening Rate (₹/hr)', value: `₹${config.hourlyRates.evening}`, color: '#60a5fa' },
  ]

  return (
    <div className="stack" style={{ gap: 28 }}>
      {/* Header */}
      <div className="page-head" style={{ margin: 0 }}>
        <h1 className="page-title">Welcome back 👋</h1>
        <p className="page-sub">{config.turfName} — {config.city}</p>
      </div>

      {/* Stats Grid */}
      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Preview */}
      <div>
        <div className="card-head" style={{ marginBottom: 14 }}>
          <h2 className="card-title">Recent Bookings</h2>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                {['ID', 'Customer', 'Phone', 'Slot', 'Amount', 'Status'].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '10px 16px', fontFamily: 'monospace', color: 'var(--accent)', fontSize: '0.8rem' }}>{b.id}</td>
                  <td style={{ padding: '10px 16px', fontWeight: 600 }}>{b.customerName}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--muted)' }}>{b.customerPhone}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--muted)' }}>{b.date} · {b.slotTime}</td>
                  <td style={{ padding: '10px 16px', fontWeight: 700 }}>₹{b.totalAmount}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span className="badge" style={{
                      background: b.paymentStatus === 'CONFIRMED' ? '#dcfce7' : b.paymentStatus === 'CANCELLED' ? '#fee2e2' : '#fef9c3',
                      color: b.paymentStatus === 'CONFIRMED' ? '#15803d' : b.paymentStatus === 'CANCELLED' ? '#dc2626' : '#b45309',
                      border: 'none',
                    }}>
                      {b.paymentStatus === 'CONFIRMED' ? '✓ Confirmed' : b.paymentStatus === 'CANCELLED' ? '✗ Cancelled' : '⏳ Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
