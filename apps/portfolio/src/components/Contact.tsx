'use client'

import { ArrowUpRight, Download, Github, Linkedin, Loader2, Mail, Send } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Profile } from './portfolio-types'
import { fallbackProfile } from './data/fallback'
import { Magnetic, SectionReveal, motion } from './ui/MotionPrimitives'

type Props = {
  profile?: Profile
}

type FormState = { name: string; email: string; subject: string; message: string }
const initialForm: FormState = { name: '', email: '', subject: '', message: '' }

export default function Contact({ profile }: Props) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const name = profile?.name || fallbackProfile.name
  const email = profile?.email || fallbackProfile.email
  const linkedin = profile?.linkedin || fallbackProfile.linkedin
  const github = profile?.github || fallbackProfile.github
  const openToWork = profile?.openToWork ?? fallbackProfile.openToWork
  const availability = profile?.availabilityText || fallbackProfile.availabilityText
  const resumeUrl = profile?.resumeUrl || '/resume.pdf'
  const firstName = name.split(' ')[0]

  const update = (field: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState('loading')
    setMessage('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject || undefined,
          message: form.message,
        }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || 'Could not send the message')
      setState('success')
      setMessage(`Thanks — your message reached ${firstName}. Expect a reply soon.`)
      setForm(initialForm)
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : 'Could not send the message')
    }
  }

  const socials = [
    { label: 'GitHub', href: github, icon: <Github size={16} /> },
    { label: 'LinkedIn', href: linkedin, icon: <Linkedin size={16} /> },
    { label: 'Email', href: `mailto:${email}`, icon: <Mail size={16} /> },
  ]

  return (
    <section id="contact" className="contact">
      <div className="container">
        <SectionReveal className="contact-cta">
          <span className="status">
            {openToWork ? <span className="dot" aria-hidden /> : null}
            {availability}
          </span>
          <h2>Want to hire me?</h2>
          <p>
            I&apos;m actively looking for full-time roles where I can build intelligent, scalable
            products. Let&apos;s talk about how I can add value to your team.
          </p>
          <div className="hero-cta">
            <Magnetic className="pill dark lg" href={`mailto:${email}`}>
              Contact Me <ArrowUpRight size={17} />
            </Magnetic>
            <Magnetic className="pill lg" href={resumeUrl} download ariaLabel="Download CV (PDF)">
              Download CV <Download size={16} />
            </Magnetic>
          </div>

          <div className="contact-socials">
            <span className="contact-id">
              <span className="dot" aria-hidden />
              {name}
            </span>
            {socials.map((s) => (
              <a
                key={s.label}
                className="pill"
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {s.icon}
                {s.label}
              </a>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1} className="panel contact-form-card">
          <h3>Or send a message</h3>
          <form onSubmit={submit} className="contact-form">
            <div className="form-row">
              <label>
                Name
                <input
                  required
                  minLength={2}
                  maxLength={100}
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  placeholder="Your name"
                />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  placeholder="you@company.com"
                />
              </label>
            </div>
            <label>
              Subject
              <input
                maxLength={200}
                value={form.subject}
                onChange={(event) => update('subject', event.target.value)}
                placeholder="Role, interview, or opportunity"
              />
            </label>
            <label>
              Message
              <textarea
                required
                minLength={20}
                maxLength={2000}
                rows={5}
                value={form.message}
                onChange={(event) => update('message', event.target.value)}
                placeholder="Tell me about the role, team, and what you're looking for."
              />
            </label>

            {message ? (
              <motion.div
                className={`form-status ${state === 'error' ? 'error' : ''}`}
                role="status"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {message}
              </motion.div>
            ) : null}

            <Magnetic type="submit" className="pill dark lg" disabled={state === 'loading'} strength={0.12}>
              {state === 'loading' ? <Loader2 className="spin" size={17} /> : <Send size={16} />}
              {state === 'loading' ? 'Sending…' : 'Send message'}
            </Magnetic>
          </form>
        </SectionReveal>
      </div>
    </section>
  )
}
