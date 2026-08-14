'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, Loader2 } from 'lucide-react'

interface SettingsData {
  turfName: string; city: string; whatsappNumber: string
  gpayNumber: string; advanceAmount: number; heroTitle: string; heroTagline: string
}

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsData>({
    turfName: '', city: '', whatsappNumber: '', gpayNumber: '', advanceAmount: 500, heroTitle: '', heroTagline: ''
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d) setForm(d)
      setLoading(false)
    })
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const field = (key: keyof SettingsData, label: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={String(form[key] ?? '')}
        onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition" />
    </div>
  )

  if (loading) return <p className="text-zinc-500 text-sm">Loading settings...</p>

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-xl font-black text-white flex items-center gap-2"><Settings size={20} /> Settings</h1>

      <form onSubmit={save} className="space-y-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-zinc-300 text-sm uppercase tracking-wider">Turf Info</h2>
          {field('turfName', 'Turf Name', 'text', 'Turf Arena')}
          {field('city', 'City', 'text', 'Chennai, Tamil Nadu')}
          {field('heroTitle', 'Hero Title', 'text', 'Book Your Slot')}
          {field('heroTagline', 'Hero Tagline', 'text', 'Premium Turf Experience')}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-zinc-300 text-sm uppercase tracking-wider">Payment</h2>
          {field('whatsappNumber', 'WhatsApp Number', 'text', '9876543210')}
          {field('gpayNumber', 'GPay Number', 'text', '9876543210')}
          {field('advanceAmount', 'Advance Amount (₹)', 'number', '500')}
        </div>

        <button type="submit" disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition text-sm">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saved ? '✅ Saved!' : saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
