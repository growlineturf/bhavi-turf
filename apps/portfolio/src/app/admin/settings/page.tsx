'use client'

import { useState, useEffect } from 'react'
import {
  Settings, Save, Loader2, Image, Trophy, Globe, CreditCard,
  MapPin, Instagram, Clock, Palette, Eye, EyeOff, ExternalLink
} from 'lucide-react'

interface SettingsData {
  turfName: string
  city: string
  openingHours: string
  sportsOffered: string
  // Hero
  heroTitle: string
  heroTagline: string
  heroBannerUrl: string
  // Logo
  logoUrl: string
  logoText: string
  // Payment
  whatsappNumber: string
  gpayNumber: string
  advanceAmount: number
  // Social
  instagramUrl: string
  googleMapsUrl: string
  // Theme
  primaryColor: string
}

const DEFAULTS: SettingsData = {
  turfName: '', city: '', openingHours: '5 AM – 11 PM', sportsOffered: 'Cricket, Football',
  heroTitle: '', heroTagline: '', heroBannerUrl: '',
  logoUrl: '', logoText: '',
  whatsappNumber: '', gpayNumber: '', advanceAmount: 500,
  instagramUrl: '', googleMapsUrl: '',
  primaryColor: '#3b82f6',
}

/* ─── helper to render an input field ─────────────────────── */
function Field({
  label, value, onChange, type = 'text', placeholder = '', hint = '', prefix = '',
}: {
  label: string; value: string | number; onChange: (v: string) => void
  type?: string; placeholder?: string; hint?: string; prefix?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
        {label}
      </label>
      <div className={`flex items-center bg-zinc-800/60 border border-zinc-700/80 rounded-xl overflow-hidden focus-within:border-blue-500 transition ${prefix ? 'divide-x divide-zinc-700' : ''}`}>
        {prefix && (
          <span className="px-3 text-xs text-zinc-500 font-mono shrink-0 select-none">{prefix}</span>
        )}
        <input
          type={type}
          value={String(value ?? '')}
          onChange={(e) => onChange(type === 'number' ? String(Number(e.target.value)) : e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none"
        />
      </div>
      {hint && <p className="text-[10px] text-zinc-600">{hint}</p>}
    </div>
  )
}

/* ─── Image preview field ──────────────────────────────────── */
function ImageUrlField({
  label, value, onChange, placeholder, hint,
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; hint?: string
}) {
  const [preview, setPreview] = useState(false)

  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center bg-zinc-800/60 border border-zinc-700/80 rounded-xl overflow-hidden focus-within:border-blue-500 transition">
          <Image className="h-4 w-4 text-zinc-600 ml-3 shrink-0" />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? 'https://...'}
            className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none"
          />
          {value && (
            <a href={value} target="_blank" rel="noreferrer" className="px-3 text-zinc-500 hover:text-zinc-300 transition">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className="h-11 w-11 flex items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition shrink-0"
          title={preview ? 'Hide preview' : 'Show preview'}
        >
          {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {hint && <p className="text-[10px] text-zinc-600">{hint}</p>}
      {preview && value && (
        <div className="relative rounded-xl overflow-hidden border border-zinc-700 mt-2" style={{ height: 140 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-xs bg-zinc-900">
            Image preview
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Section card wrapper ─────────────────────────────────── */
function Section({ icon: Icon, title, children }: {
  icon: React.ElementType; title: string; children: React.ReactNode
}) {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 space-y-4">
      <h2 className="flex items-center gap-2 font-bold text-zinc-200 text-sm">
        <Icon className="h-4 w-4 text-blue-400" />
        {title}
      </h2>
      {children}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function SettingsPage() {
  const [form, setForm] = useState<SettingsData>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => { if (d) setForm((prev) => ({ ...prev, ...d })) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (key: keyof SettingsData) => (val: string) =>
    setForm((f) => ({ ...f, [key]: key === 'advanceAmount' ? Number(val) : val }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Save failed. Check connection.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-12 justify-center text-zinc-500 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading settings…
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-400" />
          Site Settings
        </h1>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
        >
          <Globe className="h-3.5 w-3.5" /> Preview site
        </a>
      </div>

      <form onSubmit={save} className="space-y-5">

        {/* ── 1. Brand Identity ────────────────────────────── */}
        <Section icon={Trophy} title="Brand Identity">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Turf Name" value={form.turfName} onChange={set('turfName')} placeholder="Turf Arena" />
            <Field label="City" value={form.city} onChange={set('city')} placeholder="Chennai, Tamil Nadu" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Opening Hours" value={form.openingHours} onChange={set('openingHours')} placeholder="5 AM – 11 PM" />
            <Field label="Sports Offered" value={form.sportsOffered} onChange={set('sportsOffered')} placeholder="Cricket, Football" />
          </div>
        </Section>

        {/* ── 2. Logo ──────────────────────────────────────── */}
        <Section icon={Image} title="Logo">
          <ImageUrlField
            label="Logo Image URL"
            value={form.logoUrl}
            onChange={set('logoUrl')}
            placeholder="https://your-cdn.com/logo.png"
            hint="Recommended: transparent PNG, square (e.g. 200×200). Leave empty to use the default icon."
          />
          <Field
            label="Logo Text (shown if no image URL)"
            value={form.logoText}
            onChange={set('logoText')}
            placeholder="TURF ARENA"
            hint="Shown as text logo fallback. Leave empty to use turfName."
          />
        </Section>

        {/* ── 3. Hero Section ──────────────────────────────── */}
        <Section icon={Globe} title="Hero / Home Banner">
          <ImageUrlField
            label="Banner Image URL"
            value={form.heroBannerUrl}
            onChange={set('heroBannerUrl')}
            placeholder="https://images.unsplash.com/photo-..."
            hint="Use a high-res landscape image (1600×900+). Unsplash, Cloudinary, or any CDN URL works. No upload needed."
          />
          <Field
            label="Hero Title"
            value={form.heroTitle}
            onChange={set('heroTitle')}
            placeholder="Book Your Slot"
          />
          <Field
            label="Hero Tagline"
            value={form.heroTagline}
            onChange={set('heroTagline')}
            placeholder="Premium turf experience in Chennai"
          />
        </Section>

        {/* ── 4. Payment ───────────────────────────────────── */}
        <Section icon={CreditCard} title="Payment & Booking">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="WhatsApp Number"
              value={form.whatsappNumber}
              onChange={set('whatsappNumber')}
              placeholder="9876543210"
              hint="10-digit number without +91"
            />
            <Field
              label="GPay / UPI Number"
              value={form.gpayNumber}
              onChange={set('gpayNumber')}
              placeholder="9876543210"
            />
          </div>
          <Field
            label="Advance Amount (₹)"
            value={form.advanceAmount}
            onChange={set('advanceAmount')}
            type="number"
            placeholder="500"
            hint="Minimum advance customers must pay to confirm their slot"
          />
        </Section>

        {/* ── 5. Social & Location ─────────────────────────── */}
        <Section icon={MapPin} title="Social & Location">
          <ImageUrlField
            label="Google Maps URL"
            value={form.googleMapsUrl}
            onChange={set('googleMapsUrl')}
            placeholder="https://maps.google.com/?q=..."
            hint="Paste the 'Share link' from Google Maps"
          />
          <Field
            label="Instagram URL"
            value={form.instagramUrl}
            onChange={set('instagramUrl')}
            placeholder="https://instagram.com/yourturf"
          />
        </Section>

        {/* ── 6. Theme ─────────────────────────────────────── */}
        <Section icon={Palette} title="Theme">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                Accent Colour
              </label>
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => set('primaryColor')(e.target.value)}
                className="h-11 w-20 rounded-xl border border-zinc-700 bg-zinc-800 cursor-pointer p-1"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                Hex Code
              </label>
              <Field
                label=""
                value={form.primaryColor}
                onChange={set('primaryColor')}
                placeholder="#3b82f6"
              />
            </div>
            <div
              className="h-11 w-11 rounded-full border-2 border-zinc-700 shrink-0 self-end mb-0.5"
              style={{ backgroundColor: form.primaryColor }}
            />
          </div>
          <p className="text-[10px] text-zinc-600">
            Sets the primary button/accent colour across the site. Default: #3b82f6 (blue)
          </p>
        </Section>

        {/* Save */}
        {error && <p className="text-red-400 text-xs text-center">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition text-sm"
        >
          {saving
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
            : saved
              ? '✅ Settings Saved!'
              : <><Save className="h-4 w-4" /> Save All Settings</>
          }
        </button>

        <p className="text-center text-[10px] text-zinc-700 pb-4">
          Changes are applied instantly across the consumer site — no redeployment needed.
        </p>
      </form>
    </div>
  )
}
