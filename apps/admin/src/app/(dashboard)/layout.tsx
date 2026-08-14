'use client'

import { useState, type ReactNode } from 'react'
import { AdminProvider, useAdmin } from '@/lib/adminStore'
import DashboardShell from './DashboardShell'
import { Lock, Trophy, Eye, EyeOff } from 'lucide-react'

function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, setIsAuthenticated, config } = useAdmin()
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [show, setShow] = useState(false)

  if (isAuthenticated) {
    return <DashboardShell userEmail="Admin">{children}</DashboardShell>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code === config.masterCode) {
      setIsAuthenticated(true)
      setError(false)
    } else {
      setError(true)
      setCode('')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0a', padding: 24
    }}>
      <div style={{
        width: '100%', maxWidth: 380, background: '#111', borderRadius: 20,
        border: '1px solid #222', padding: '40px 36px', textAlign: 'center'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: '#2563eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Trophy size={28} color="#fff" />
          </div>
        </div>

        <h1 style={{ color: '#f9fafb', fontWeight: 900, fontSize: '1.4rem', margin: '0 0 6px' }}>
          Turf Arena
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '0 0 28px' }}>
          Admin Panel — Enter master code to continue
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ position: 'relative' }}>
            <input
              type={show ? 'text' : 'password'}
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(false) }}
              placeholder="Enter master code"
              autoFocus
              style={{
                width: '100%', padding: '12px 44px 12px 16px', borderRadius: 12,
                border: `1.5px solid ${error ? '#ef4444' : '#2d2d2d'}`,
                background: '#1a1a1a', color: '#f9fafb', fontSize: '1rem',
                outline: 'none', boxSizing: 'border-box',
                letterSpacing: show ? 'normal' : '0.2em'
              }}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: 0 }}>
              ✗ Incorrect master code. Try again.
            </p>
          )}

          <button
            type="submit"
            style={{
              background: '#2563eb', color: '#fff', border: 'none', borderRadius: 12,
              padding: '13px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.15s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#2563eb')}
          >
            <Lock size={16} /> Unlock Admin Panel
          </button>
        </form>

        <p style={{ color: '#374151', fontSize: '0.72rem', marginTop: 24 }}>
          This panel is private. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <AuthGate>{children}</AuthGate>
    </AdminProvider>
  )
}
