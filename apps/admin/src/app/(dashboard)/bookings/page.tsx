'use client'

import { useAdmin } from '@/lib/adminStore'
import { MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function BookingsPage() {
  const { bookings, confirmBooking, cancelBooking, config } = useAdmin()

  const whatsappMsg = (b: ReturnType<typeof useAdmin>['bookings'][0]) =>
    encodeURIComponent(
      `✅ Hi ${b.customerName}! Your slot at ${config.turfName} is CONFIRMED.\n\n` +
      `📅 Date: ${b.date}\n⏰ Slot: ${b.slotTime}\n⚽ Sport: ${b.sport}\n` +
      `💰 Total: ₹${b.totalAmount} | Advance Paid: ₹${b.advanceAmount}\n\n` +
      `Please arrive 15 minutes before your slot. See you on the pitch! 🏟️`
    )

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="page-head" style={{ margin: 0 }}>
        <h1 className="page-title">Bookings</h1>
        <p className="page-sub">Verify advance payments and confirm customer slots.</p>
      </div>

      {/* Pending first */}
      {['PENDING_VERIFICATION', 'CONFIRMED', 'CANCELLED'].map((status) => {
        const filtered = bookings.filter((b) => b.paymentStatus === status)
        if (!filtered.length) return null

        return (
          <div key={status}>
            <div className="card-head" style={{ marginBottom: 12 }}>
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {status === 'PENDING_VERIFICATION' && <><Clock size={16} style={{ color: '#f59e0b' }} /> Pending Verification ({filtered.length})</>}
                {status === 'CONFIRMED' && <><CheckCircle size={16} style={{ color: '#22c55e' }} /> Confirmed ({filtered.length})</>}
                {status === 'CANCELLED' && <><XCircle size={16} style={{ color: '#ef4444' }} /> Cancelled ({filtered.length})</>}
              </h2>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    {['Booking ID', 'Customer', 'Phone', 'Date & Slot', 'Sport', 'Total', 'Advance', 'Actions'].map((h) => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--accent)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{b.id}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>{b.customerName}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '0.82rem' }}>{b.customerPhone}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{b.date}<br /><span style={{ fontSize: '0.78rem' }}>{b.slotTime}</span></td>
                      <td style={{ padding: '12px 14px' }}>{b.sport}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>₹{b.totalAmount}</td>
                      <td style={{ padding: '12px 14px', color: '#22c55e', fontWeight: 700 }}>₹{b.advanceAmount}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                          {/* PENDING → show Done button */}
                          {b.paymentStatus === 'PENDING_VERIFICATION' && (
                            <>
                              <button
                                onClick={() => confirmBooking(b.id)}
                                className="btn btn-sm"
                                style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 12px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                              >
                                <CheckCircle size={13} /> Done
                              </button>
                              <button
                                onClick={() => cancelBooking(b.id)}
                                className="btn btn-sm"
                                style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '5px 10px', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {/* CONFIRMED → show WhatsApp button */}
                          {b.paymentStatus === 'CONFIRMED' && (
                            <a
                              href={`https://wa.me/${b.customerPhone.replace(/\D/g, '')}?text=${whatsappMsg(b)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm"
                              style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 12px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
                            >
                              <MessageSquare size={13} /> WhatsApp
                            </a>
                          )}

                          {b.paymentStatus === 'CANCELLED' && (
                            <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
