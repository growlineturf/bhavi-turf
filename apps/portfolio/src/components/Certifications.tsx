'use client'

import Image from 'next/image'
import { Award, ChevronLeft, ChevronRight, ExternalLink, Maximize2, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Certification } from './portfolio-types'
import { fallbackCertifications } from './data/fallback'
import { AnimatePresence, SectionReveal, motion, useReducedMotion } from './ui/MotionPrimitives'

type Props = {
  certifications?: Certification[]
}

function CertDoc({ cert }: { cert: Certification }) {
  return (
    <div className="cert-doc">
      <span className="cert-doc-seal" aria-hidden>
        <Award size={26} />
      </span>
      <span className="cert-doc-kicker">Certificate of Completion</span>
      <h4 className="cert-doc-title">{cert.name}</h4>
      <span className="cert-doc-issuer">Issued by {cert.issuer}</span>
      {cert.date ? <span className="cert-doc-date">{cert.date}</span> : null}
    </div>
  )
}

export default function Certifications({ certifications }: Props) {
  const certs = certifications && certifications.length ? certifications : fallbackCertifications
  const [index, setIndex] = useState<number | null>(null)
  const modalRef = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()
  const open = index !== null
  const active = open ? certs[index] : null

  const go = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + certs.length) % certs.length)),
    [certs.length],
  )

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const sel = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const focusables = () => Array.from(modalRef.current?.querySelectorAll<HTMLElement>(sel) || [])

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIndex(null)
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Tab') {
        const items = focusables()
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    window.setTimeout(() => focusables()[0]?.focus(), 0)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open, go])

  return (
    <section id="certifications" className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-topline">
            <h2 className="section-label">
              <span className="slash">/</span>CERTIFICATIONS
            </h2>
            <span className="section-sub">{certs.length} credentials · tap to view</span>
          </div>
        </SectionReveal>

        <div className="cert-grid">
          {certs.map((cert, i) => (
            <SectionReveal key={cert.id || cert.name} delay={i * 0.05}>
              <button type="button" className="cert-card" onClick={() => setIndex(i)}>
                <span className="cert-badge" aria-hidden>
                  <Award size={20} />
                </span>
                <span className="cert-meta">
                  <span className="cert-issuer">{cert.issuer}</span>
                  <span className="cert-name">{cert.name}</span>
                  {cert.date ? <span className="cert-date">{cert.date}</span> : null}
                </span>
                <span className="cert-view" aria-hidden>
                  <Maximize2 size={16} />
                </span>
              </button>
            </SectionReveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && active ? (
          <motion.div
            className="modal-overlay"
            role="presentation"
            onMouseDown={() => setIndex(null)}
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
          >
            <motion.article
              ref={modalRef}
              className="modal-card cert-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`${active.name} certificate`}
              onMouseDown={(e) => e.stopPropagation()}
              initial={reduced ? false : { opacity: 0, y: 22, scale: 0.98 }}
              animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <button className="iconbtn cert-close" type="button" onClick={() => setIndex(null)} aria-label="Close">
                <X size={18} />
              </button>

              <div className="cert-stage">
                {active.imageUrl ? (
                  <Image src={active.imageUrl} alt={`${active.name} certificate`} fill sizes="900px" />
                ) : (
                  <CertDoc cert={active} />
                )}

                {certs.length > 1 ? (
                  <>
                    <button type="button" className="gallery-nav prev" onClick={() => go(-1)} aria-label="Previous certificate">
                      <ChevronLeft size={22} />
                    </button>
                    <button type="button" className="gallery-nav next" onClick={() => go(1)} aria-label="Next certificate">
                      <ChevronRight size={22} />
                    </button>
                  </>
                ) : null}
                <span className="gallery-counter">
                  {index! + 1} / {certs.length}
                </span>
              </div>

              <div className="cert-modal-info">
                <div>
                  <span className="cert-issuer">{active.issuer}</span>
                  <h3>{active.name}</h3>
                  {active.date ? <span className="cert-date">{active.date}</span> : null}
                </div>
                {active.credentialUrl ? (
                  <a className="pill dark" href={active.credentialUrl} target="_blank" rel="noopener noreferrer">
                    Verify credential <ExternalLink size={15} />
                  </a>
                ) : null}
              </div>

              {certs.length > 1 ? (
                <div className="cert-thumbs">
                  {certs.map((cert, i) => (
                    <button
                      key={cert.id || cert.name}
                      type="button"
                      className={`cert-thumb ${i === index ? 'active' : ''}`}
                      onClick={() => setIndex(i)}
                      aria-label={`View ${cert.name}`}
                    >
                      {cert.imageUrl ? (
                        <Image src={cert.imageUrl} alt="" fill sizes="120px" />
                      ) : (
                        <span className="cert-thumb-ph">
                          <Award size={16} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : null}
            </motion.article>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
