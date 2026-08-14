'use client'

import { useState } from 'react'
import { useAdmin } from '@/lib/adminStore'
import { Save, DollarSign } from 'lucide-react'

const TIME_BLOCKS = [
  { key: 'twilight', label: 'Twilight', range: '5:00 AM – 8:00 AM', color: '#818cf8' },
  { key: 'morning',  label: 'Morning',  range: '8:00 AM – 12:00 PM', color: '#fbbf24' },
  { key: 'noon',     label: 'Noon',     range: '12:00 PM – 4:00 PM', color: '#f97316' },
  { key: 'evening',  label: 'Evening',  range: '4:00 PM – 11:00 PM', color: '#22d3ee' },
] as const

export default function PricingPage() {
  const { config, updateConfig } = useAdmin()
  const [rates, setRates] = useState({ ...config.hourlyRates })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateConfig({ hourlyRates: rates })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="stack" style={{ gap: 28 }}>
      <div className="page-head" style={{ margin: 0 }}>
        <h1 className="page-title">Slot Pricing</h1>
        <p className="page-sub">Set hourly rate per time block. Prices shown to customers on the booking page.</p>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <div className="card-head">
          <h2 className="card-title"><DollarSign size={16} /> Hourly Rates (₹ per hour)</h2>
        </div>

        <div className="stack" style={{ gap: 18, marginTop: 20 }}>
          {TIME_BLOCKS.map((block) => (
            <div key={block.key} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: block.color, flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{block.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{block.range}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>₹</span>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={rates[block.key]}
                  onChange={(e) => setRates((p) => ({ ...p, [block.key]: Number(e.target.value) }))}
                  style={{
                    width: 100, padding: '8px 12px', borderRadius: 10,
                    border: '1.5px solid var(--line)', background: 'var(--surface-2)',
                    color: 'var(--fg)', fontWeight: 700, fontSize: '1rem',
                    outline: 'none', textAlign: 'right'
                  }}
                />
                <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>/hr</span>
              </div>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div style={{ marginTop: 24, padding: '14px 16px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            15-min slot prices (auto-calculated)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {TIME_BLOCKS.map((block) => (
              <div key={block.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: block.color, fontWeight: 600 }}>{block.label}</span>
                <span style={{ fontWeight: 700 }}>₹{Math.round(rates[block.key] / 4)} / 15 min</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <button onClick={handleSave} className="btn" style={{ display: 'flex', alignItems: 'center', gap: 8, background: saved ? '#22c55e' : '' }}>
            <Save size={15} />
            {saved ? '✓ Saved!' : 'Save Pricing'}
          </button>
        </div>
      </div>
    </div>
  )
}
