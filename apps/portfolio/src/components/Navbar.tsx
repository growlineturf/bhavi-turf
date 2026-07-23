'use client'

import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from './ui/MotionPrimitives'

type Props = {
  openToWork?: boolean
  availabilityText?: string
  counts?: { work?: number; expertise?: number; experience?: number }
}

export default function Navbar({ openToWork = true, availabilityText = 'Open to Work', counts }: Props) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reducedMotion = useReducedMotion()

  const navItems = [
    { label: 'Work', id: 'work', count: counts?.work },
    { label: 'Expertise', id: 'expertise', count: counts?.expertise },
    { label: 'Experience', id: 'experience', count: counts?.experience },
    { label: 'Contact', id: 'contact', count: undefined as number | undefined },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const scrollTo = (id: string) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? 'scrolled' : ''}`}
        initial={reducedMotion ? false : { opacity: 0, y: -16 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <nav className="nav-inner container" aria-label="Main navigation">
          <div className="nav-left">
            <button type="button" className="nav-brand" onClick={() => scrollTo('home')} aria-label="Back to top">
              AS
            </button>
            <button
              type="button"
              className="status nav-status"
              onClick={() => scrollTo('home')}
              aria-label="Back to top"
            >
              {openToWork ? <span className="dot" aria-hidden /> : null}
              {availabilityText}
            </button>
          </div>

          <div className="nav-links">
            {navItems.map((item) => (
              <button key={item.id} type="button" className="nav-link" onClick={() => scrollTo(item.id)}>
                {item.label}
                {typeof item.count === 'number' ? <span className="count">[{item.count}]</span> : null}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!open ? (
              <button type="button" className="pill dark nav-hire" onClick={() => scrollTo('contact')}>
                Hire Me <ArrowUpRight size={16} />
              </button>
            ) : null}
            <button
              className="nav-menu"
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={reducedMotion ? undefined : { opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <div className="mobile-menu-links">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  type="button"
                  className="mobile-menu-link"
                  onClick={() => scrollTo(item.id)}
                  initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                  animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.06 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="mobile-menu-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="mobile-menu-label">{item.label}</span>
                  {typeof item.count === 'number' ? <span className="count">[{item.count}]</span> : null}
                  <ArrowUpRight size={22} />
                </motion.button>
              ))}
            </div>

            <motion.div
              className="mobile-menu-foot"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="status">
                {openToWork ? <span className="dot" aria-hidden /> : null}
                {availabilityText}
              </span>
              <button type="button" className="pill dark lg" onClick={() => scrollTo('contact')}>
                Hire Me <ArrowUpRight size={17} />
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
