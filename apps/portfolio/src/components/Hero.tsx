'use client'

import Image from 'next/image'
import { ArrowUpRight, Download, Github, Linkedin, Mail } from 'lucide-react'
import type { Profile } from './portfolio-types'
import { fallbackProfile } from './data/fallback'
import { Magnetic, motion, useReducedMotion } from './ui/MotionPrimitives'

type Props = {
  profile?: Profile
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return { first: parts[0], rest: '' }
  return { first: parts[0], rest: parts.slice(1).join(' ') }
}

export default function Hero({ profile }: Props) {
  const reducedMotion = useReducedMotion()

  const name = profile?.name || fallbackProfile.name
  const title = profile?.title || fallbackProfile.title
  const tagline = profile?.tagline || fallbackProfile.tagline
  const availability = profile?.availabilityText || fallbackProfile.availabilityText
  const openToWork = profile?.openToWork ?? fallbackProfile.openToWork
  const github = profile?.github || fallbackProfile.github
  const linkedin = profile?.linkedin || fallbackProfile.linkedin
  const email = profile?.email || fallbackProfile.email
  const portrait = profile?.avatarUrl || '/portrait.jpg'
  const resumeUrl = profile?.resumeUrl || '/resume.pdf'

  const { first, rest } = splitName(name)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  const socials = [
    { label: 'GitHub', href: github, icon: <Github size={16} /> },
    { label: 'LinkedIn', href: linkedin, icon: <Linkedin size={16} /> },
    { label: 'Email', href: `mailto:${email}`, icon: <Mail size={16} /> },
  ]

  return (
    <section id="home" className="hero">
      <div className="container">
        <motion.div
          className="panel hero-card"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-topbar">
            <span className="status">
              {openToWork ? <span className="dot" aria-hidden /> : null}
              {availability}
            </span>
          </div>

          <h1 className="hero-name">
            <span className="outline">{first}</span>
            {rest ? <span className="solid">{rest}</span> : null}
          </h1>

          <div className="hero-portrait-wrap">
            <motion.div
              className="hero-portrait"
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={portrait}
                alt={`${name}, ${title}`}
                fill
                priority
                sizes="(max-width: 900px) 60vw, 320px"
              />
            </motion.div>
          </div>

          <div className="hero-foot">
            <motion.div
              className="hero-left"
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="hero-role">{title}</p>
              <p className="hero-tag">{tagline}</p>
              <div className="hero-cta">
                <Magnetic className="pill dark lg" onClick={() => scrollTo('contact')}>
                  Hire Me <ArrowUpRight size={17} />
                </Magnetic>
                <Magnetic className="pill lg" href={resumeUrl} download ariaLabel="Download CV (PDF)">
                  Download CV <Download size={16} />
                </Magnetic>
              </div>
            </motion.div>

            <motion.div
              className="hero-right"
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Profile links"
            >
              {socials.map((s) => (
                <Magnetic
                  key={s.label}
                  className="pill"
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  strength={0.25}
                >
                  {s.icon}
                  {s.label}
                </Magnetic>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
