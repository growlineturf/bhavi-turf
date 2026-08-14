'use client'

import { useState } from 'react'
import { useAdmin } from '@/lib/adminStore'
import { Save, CreditCard, Copy, Check } from 'lucide-react'

// Auto-format Indian WhatsApp: strip anything non-digit, prepend 91
const toWaNumber = (n: string) => '91' + n.replace(/\D/g, '').slice(-10)

export default function PaymentsPage() {
  const { config, updateConfig } = useAdmin()
  const [form, setForm] = useState({
    gpayNumber: config.gpayNumber,
    upiId: config.upiId,
    advanceAmount: config.advanceAmount,
    whatsappNumber: config.whatsappNumber,
  })
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateConfig(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const copyUpi = () => {
    navigator.clipboard.writeText(form.upiId || form.gpayNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="stack" style={{ gap: 28 }}>
      <div className="page-head" style={{ margin: 0 }}>
        <h1 className="page-title">GPay & Payment</h1>
        <p className="page-sub">Set the advance amount and payment details shown to customers at checkout.</p>
      </div>

      <form onSubmit={handleSave} className="stack" style={{ gap: 20, maxWidth: 520 }}>
        <div className="card">
          <div className="card-head"><h2 className="card-title"><CreditCard size={15} /> Payment Details</h2></div>
          <div className="stack" style={{ gap: 16, marginTop: 18 }}>
            <div className="field">
              <label className="field-label">GPay / Phone Number</label>
              <input className="field-input" type="text" value={form.gpayNumber}
                placeholder="e.g. 9876543210"
                onChange={(e) => setForm((p) => ({ ...p, gpayNumber: e.target.value }))} />
            </div>

            <div className="field">
              <label className="field-label">UPI ID (optional)</label>
              <input className="field-input" type="text" value={form.upiId}
                placeholder="e.g. 9876543210@gpay or name@upi"
                onChange={(e) => setForm((p) => ({ ...p, upiId: e.target.value }))} />
            </div>

            <div className="field">
              <label className="field-label">Advance Amount (₹)</label>
              <input className="field-input" type="number" min={0} step={50} value={form.advanceAmount}
                onChange={(e) => setForm((p) => ({ ...p, advanceAmount: Number(e.target.value) }))} />
            </div>

            <div className="field">
              <label className="field-label">WhatsApp Number (10-digit Indian number)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <span style={{ padding: '10px 12px', background: 'var(--surface-3)', border: '1.5px solid var(--line-strong)', borderRight: 'none', borderRadius: 'var(--r-sm) 0 0 var(--r-sm)', color: 'var(--muted)', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>🇮🇳 +91</span>
                <input
                  className="field-input"
                  type="tel"
                  maxLength={10}
                  value={form.whatsappNumber.replace(/^91/, '').slice(0,10)}
                  placeholder="9876543210"
                  onChange={(e) => setForm((p) => ({ ...p, whatsappNumber: toWaNumber(e.target.value) }))}
                  style={{ borderRadius: '0 var(--r-sm) var(--r-sm) 0' }}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>Enter your 10-digit mobile number. Country code +91 is added automatically.</p>
            </div>
          </div>
        </div>

        {/* Checkout Preview */}
        <div className="card" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
          <div className="card-head"><h2 className="card-title">Customer Checkout Preview</h2></div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#1e293b', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 4 }}>Advance Amount</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#22d3ee' }}>₹{form.advanceAmount}</div>
            </div>
            <div style={{ background: '#1e293b', borderRadius: 12, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 2 }}>Pay to GPay</div>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#f0f9ff' }}>{form.upiId || form.gpayNumber || '—'}</div>
              </div>
              <button type="button" onClick={copyUpi} style={{ background: '#334155', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem' }}>
                {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
              </button>
            </div>
            <div style={{ background: '#1e293b', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 2 }}>Send Screenshot To</div>
              <div style={{ fontWeight: 700, color: '#4ade80' }}>
                WhatsApp: {form.whatsappNumber ? `+${form.whatsappNumber} (wa.me/${form.whatsappNumber})` : '—'}
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn" style={{ display: 'flex', alignItems: 'center', gap: 8, background: saved ? '#22c55e' : '' }}>
          <Save size={15} />
          {saved ? '✓ Saved!' : 'Save Payment Settings'}
        </button>
      </form>
    </div>
  )
}
