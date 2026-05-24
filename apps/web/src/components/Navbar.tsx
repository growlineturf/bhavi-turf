'use client'
import { useState, useEffect } from 'react'

const LINKS = ['About', 'Skills', 'Projects', 'Experience', 'Contact']

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scroll = (id: string) => {
    setOpen(false)
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: scrolled ? 'rgba(8,8,15,0.92)' : 'rgba(8,8,15,0.6)',
        borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
        transition: 'background 0.35s, border-color 0.35s',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Logo */}
          <button onClick={() => scroll('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <span style={{
              color: '#C2A878', fontWeight: 800, fontSize: '1.25rem',
              letterSpacing: '-0.01em', fontFamily: 'inherit',
            }}>AS.</span>
          </button>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} className="desk-nav">
            {LINKS.map(l => (
              <button key={l} onClick={() => scroll(l)}
                className="nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '0.35rem 0.75rem' }}>
                {l}
              </button>
            ))}
            <a href="/admin" style={{
              marginLeft: '1rem', padding: '0.45rem 1rem',
              borderRadius: '8px', border: '1px solid rgba(194,168,120,0.25)',
              color: '#C2A878', fontSize: '0.78rem', fontWeight: 600,
              textDecoration: 'none', letterSpacing: '0.02em',
              transition: 'all 0.2s', background: 'rgba(194,168,120,0.06)',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(194,168,120,0.14)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(194,168,120,0.5)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(194,168,120,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(194,168,120,0.25)' }}>
              Admin ↗
            </a>
          </nav>

          {/* Hamburger */}
          <button onClick={() => setOpen(!open)} className="ham-btn"
            style={{ display: 'none', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#F0EEE8', fontSize: '1.1rem', cursor: 'pointer', width: 38, height: 38, alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            {open ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{
            background: 'var(--surface)', borderTop: '1px solid var(--border)',
            padding: '1rem 1.75rem 1.25rem', display: 'flex',
            flexDirection: 'column', gap: '0.35rem',
          }}>
            {LINKS.map(l => (
              <button key={l} onClick={() => scroll(l)}
                className="nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', padding: '0.55rem 0', borderBottom: '1px solid var(--border)', width: '100%' }}>
                {l}
              </button>
            ))}
            <a href="/admin" style={{ color: '#C2A878', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', padding: '0.55rem 0' }}>
              Admin Panel ↗
            </a>
          </div>
        )}
      </header>

      <style>{`
        @media(max-width:640px) { .desk-nav { display:none !important } .ham-btn { display:inline-flex !important } }
      `}</style>
    </>
  )
}
