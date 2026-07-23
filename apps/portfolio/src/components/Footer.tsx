'use client'

import { Github, Linkedin, Mail } from 'lucide-react'
import type { Profile } from './portfolio-types'
import { fallbackProfile } from './data/fallback'

type Props = {
  profile?: Profile
}

export default function Footer({ profile }: Props) {
  const name = profile?.name || fallbackProfile.name
  const email = profile?.email || fallbackProfile.email
  const github = profile?.github || fallbackProfile.github
  const linkedin = profile?.linkedin || fallbackProfile.linkedin
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const year = 2026

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-mark">{initials}</span>
          <div>
            <div>{name}</div>
            <p>© {year} — Built to be hired.</p>
          </div>
        </div>

        <div className="footer-links">
          <a className="iconbtn" href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github size={18} />
          </a>
          <a className="iconbtn" href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin size={18} />
          </a>
          <a className="iconbtn" href={`mailto:${email}`} aria-label="Email">
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}
