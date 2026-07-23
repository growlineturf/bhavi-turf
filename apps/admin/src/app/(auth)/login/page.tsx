'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [show, setShow]         = useState(false)
  const router = useRouter()

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.success) router.push('/')
    else setError('Incorrect password. Please try again.')
  }

  return (
    <div className="admin-wrap">
      <div className="admin-login-page">
        <div className="admin-login-card">
          {/* Glow orb */}
          <div style={{
            position: 'absolute', width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(194,168,120,0.08) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)', left: '50%', top: '35%', pointerEvents: 'none',
          }} />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 56, height: 56, borderRadius: 16,
              background: 'var(--a-gold-dim)', border: '1px solid var(--a-border-gold)',
              fontSize: '1.5rem', marginBottom: '1rem',
            }}>🔐</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--a-text-1)', letterSpacing: '-0.02em' }}>
              Admin Panel
            </h1>
            <p style={{ color: 'var(--a-text-2)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
              Sign in to manage your portfolio
            </p>
          </div>

          {/* Card */}
          <div className="a-card" style={{ padding: '2rem', position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 'var(--a-radius)',
              background: 'linear-gradient(135deg, rgba(194,168,120,0.02) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />
            <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
              <div>
                <label className="a-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    autoFocus
                    className="a-input"
                    style={{ paddingRight: '3rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    style={{
                      position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--a-text-3)', fontSize: '0.85rem', padding: 0,
                    }}
                  >{show ? '🙈' : '👁️'}</button>
                </div>
              </div>

              {error && (
                <div className="a-toast a-toast-error" style={{ margin: 0 }}>
                  <span>⚠</span> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="a-btn a-btn-gold"
                style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}
              >
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
                    Verifying…
                  </>
                ) : 'Sign In →'}
              </button>

              <div style={{
                textAlign: 'center', fontSize: '0.72rem', color: 'var(--a-text-3)',
                padding: '0.75rem', background: 'rgba(255,255,255,0.02)',
                borderRadius: 'var(--a-radius-sm)', border: '1px solid var(--a-border)',
              }}>
                Default password: <code style={{ color: 'var(--a-gold)', fontFamily: 'monospace' }}>admin123</code>
                <br />Change via <code style={{ color: 'var(--a-gold)', fontFamily: 'monospace' }}>ADMIN_PASSWORD</code> env var
              </div>
            </form>
          </div>

          {/* Back link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <a href={process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'http://localhost:3000'} style={{ color: 'var(--a-text-3)', fontSize: '0.8rem', textDecoration: 'none' }}>
              ← Back to Portfolio
            </a>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
