'use client'
import { useState, useEffect } from 'react'

type Profile = {
  name: string; title: string; tagline: string
  openToWork: boolean; github: string; linkedin: string
}
type Props = { profile?: Profile }

export default function Hero({ profile }: Props) {
  const [resumeExists, setResumeExists] = useState<boolean|null>(null)

  useEffect(() => {
    fetch('/resume.pdf', { method: 'HEAD' })
      .then(r => setResumeExists(r.ok))
      .catch(() => setResumeExists(false))
  }, [])

  const name      = profile?.name    ?? 'Abarna Sivakumar'
  const [first, ...rest] = name.split(' ')
  const lastName  = rest.join(' ')
  const title     = profile?.title   ?? 'AI & Full-Stack Developer'
  const tagline   = profile?.tagline ?? 'I build intelligent, scalable digital products.'
  const openToWork = profile?.openToWork ?? true

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" className="hero-section">
      {/* Animated bg mesh */}
      <div className="hero-mesh" aria-hidden />
      <div className="hero-glow" aria-hidden />

      <div className="hero-inner">
        {/* Badge */}
        {openToWork && (
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Open to full-time opportunities from 2026
          </div>
        )}

        {/* Name */}
        <h1 className="hero-title">
          <span className="hero-title-gold">{first}</span>
          {' '}
          <span className="hero-title-white">{lastName}</span>
        </h1>

        {/* Role */}
        <p className="hero-role">{title}</p>

        {/* Tagline */}
        <p className="hero-tagline">{tagline}</p>

        {/* CTAs */}
        <div className="hero-ctas">
          <button className="btn-gold" onClick={() => scrollTo('projects')}>
            View Projects →
          </button>

          {resumeExists === null ? (
            <button className="btn-ghost" disabled style={{ opacity: 0.5, cursor: 'wait' }}>
              Loading…
            </button>
          ) : resumeExists ? (
            <a href="/resume.pdf" className="btn-ghost" download="Abarna_Sivakumar_Resume.pdf">
              Download Resume ↓
            </a>
          ) : (
            <button className="btn-ghost" disabled
              style={{ opacity: 0.4, cursor: 'not-allowed' }}
              title="Resume not uploaded yet">
              Resume (Soon)
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="hero-stats">
          {[
            ['8.5', 'CGPA'],
            ['2+', 'Projects'],
            ['2',  'Internships'],
            ['4+', 'Certifications'],
          ].map(([n, l]) => (
            <div key={l} className="hero-stat">
              <div className="hero-stat-num">{n}</div>
              <div className="hero-stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes heroPulse  { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes heroFloat  { 0%,100%{transform:translateY(0) translateX(-50%)} 50%{transform:translateY(-18px) translateX(-50%)} }
        @keyframes meshMove   { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

        .hero-section {
          min-height: 100svh;
          display: flex; align-items: center; justify-content: center;
          text-align: center; padding: 6rem 1.5rem 4rem;
          position: relative; overflow: hidden;
        }
        .hero-mesh {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle at 1px 1px, rgba(194,168,120,0.08) 1px, transparent 0);
          background-size: 36px 36px;
        }
        .hero-glow {
          position: absolute; top: 15%; left: 50%; width: 700px; height: 700px;
          transform: translateX(-50%); pointer-events: none;
          background: radial-gradient(ellipse, rgba(194,168,120,0.055) 0%, transparent 68%);
          animation: heroFloat 8s ease-in-out infinite;
        }
        .hero-inner {
          position: relative; z-index: 1; max-width: 860px; margin: 0 auto; width: 100%;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 0.55rem;
          background: rgba(194,168,120,0.08);
          border: 1px solid rgba(194,168,120,0.28);
          border-radius: 999px; padding: 0.38rem 1.1rem;
          margin-bottom: 2.25rem; font-size: 0.78rem;
          color: #C2A878; font-weight: 500; letter-spacing: 0.02em;
        }
        .hero-badge-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #C2A878;
          animation: heroPulse 2s ease-in-out infinite; flex-shrink: 0;
          box-shadow: 0 0 8px rgba(194,168,120,0.6);
        }
        .hero-title {
          font-size: clamp(3rem, 9vw, 7rem);
          font-weight: 800; line-height: 1.02;
          letter-spacing: -0.035em; margin-bottom: 1rem;
        }
        .hero-title-gold  { color: #C2A878; }
        .hero-title-white { color: #F0EEE8; }
        .hero-role {
          font-size: clamp(1rem, 2.5vw, 1.3rem);
          color: #8A8699; font-weight: 400;
          margin-bottom: 0.85rem; letter-spacing: 0.03em;
        }
        .hero-tagline {
          font-size: clamp(0.95rem, 2vw, 1.1rem);
          color: #C8C4BD; max-width: 500px;
          margin: 0 auto 2.75rem; line-height: 1.75;
        }
        .hero-ctas {
          display: flex; gap: 0.875rem; justify-content: center; flex-wrap: wrap;
          margin-bottom: 4.5rem;
        }
        .hero-stats {
          display: flex; gap: 0; justify-content: center;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 2.75rem; flex-wrap: wrap;
        }
        .hero-stat {
          text-align: center; padding: 0 2.5rem;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .hero-stat:last-child { border-right: none; }
        .hero-stat-num   { font-size: 2.1rem; font-weight: 800; color: #C2A878; letter-spacing: -0.03em; line-height: 1; }
        .hero-stat-label { font-size: 0.7rem; color: #8A8699; margin-top: 0.3rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; }

        @media (max-width: 640px) {
          .hero-stat { padding: 0 1.25rem; }
          .hero-stats { gap: 0.5rem; }
        }
      `}</style>
    </section>
  )
}
