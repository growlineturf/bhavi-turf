'use client'

import Lenis from 'lenis'
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  type HTMLMotionProps,
} from 'framer-motion'
import type { CSSProperties, PointerEvent, ReactNode, Ref } from 'react'
import { useEffect, useRef, useState } from 'react'

type MotionShellProps = {
  children: ReactNode
}

export function MotionShell({ children }: MotionShellProps) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    // screenshot/QA escape hatch: freeze layout in settled state, skip smooth scroll
    if (window.location.search.includes('static')) {
      document.documentElement.classList.add('qa-static')
    }
  }, [])

  useEffect(() => {
    if (reducedMotion || window.innerWidth < 820) return
    if (window.location.search.includes('static')) return // screenshot/QA escape hatch

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }

    frame = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [reducedMotion])

  return (
    <>
      <ScrollProgress />
      {children}
    </>
  )
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: scrollYProgress }}
      aria-hidden
    />
  )
}

type SectionRevealProps = HTMLMotionProps<'div'> & {
  children: ReactNode
  delay?: number
}

export function SectionReveal({
  children,
  delay = 0,
  className,
  ...props
}: SectionRevealProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 26 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

type SpotlightCardProps = HTMLMotionProps<'div'> & {
  children: ReactNode
  tone?: 'default' | 'gold' | 'teal' | 'rose' | 'violet'
}

export function SpotlightCard({
  children,
  className = '',
  tone = 'default',
  ...props
}: SpotlightCardProps) {
  const reducedMotion = useReducedMotion()
  const [spotlight, setSpotlight] = useState<CSSProperties>({
    '--spotlight-x': '50%',
    '--spotlight-y': '0%',
  } as CSSProperties)

  return (
    <motion.div
      className={`spotlight-card tone-${tone} ${className}`}
      style={spotlight}
      onPointerMove={(event) => {
        if (reducedMotion) return
        const rect = event.currentTarget.getBoundingClientRect()
        setSpotlight({
          '--spotlight-x': `${event.clientX - rect.left}px`,
          '--spotlight-y': `${event.clientY - rect.top}px`,
        } as CSSProperties)
      }}
      whileHover={reducedMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

type GlassPanelProps = HTMLMotionProps<'div'> & {
  children: ReactNode
  tone?: SpotlightCardProps['tone']
}

export function GlassPanel({
  children,
  className = '',
  tone = 'default',
  ...props
}: GlassPanelProps) {
  return (
    <SpotlightCard tone={tone} className={`glass-panel ${className}`} {...props}>
      {children}
    </SpotlightCard>
  )
}

type MagneticButtonProps = {
  children: ReactNode
  className?: string
  href?: string
  target?: string
  rel?: string
  download?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function MagneticButton({
  children,
  className = '',
  href,
  target,
  rel,
  download,
  disabled,
  type = 'button',
  ariaLabel,
  onClick,
  variant = 'secondary',
}: MagneticButtonProps) {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null)

  const reset = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  const move = (event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (reducedMotion || disabled) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left - rect.width / 2) * 0.12
    const y = (event.clientY - rect.top - rect.height / 2) * 0.12
    event.currentTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  const buttonClass = `glass-button ${variant === 'primary' ? 'primary' : ''} ${variant === 'ghost' ? 'ghost' : ''} ${className}`.trim()

  if (href && !disabled) {
    return (
      <motion.a
        ref={ref as Ref<HTMLAnchorElement>}
        className={buttonClass}
        href={href}
        target={target}
        rel={rel}
        download={download}
        aria-label={ariaLabel}
        onPointerMove={move}
        onPointerLeave={reset}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as Ref<HTMLButtonElement>}
      className={buttonClass}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      onPointerMove={move}
      onPointerLeave={reset}
      whileTap={reducedMotion || disabled ? undefined : { scale: 0.98 }}
    >
      {children}
    </motion.button>
  )
}

type MagneticProps = {
  children: ReactNode
  className?: string
  href?: string
  target?: string
  rel?: string
  download?: string | boolean
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  ariaLabel?: string
  strength?: number
  onClick?: () => void
}

/** Wraps any element with a subtle magnetic pull; keeps the caller's className. */
export function Magnetic({
  children,
  className = '',
  href,
  target,
  rel,
  download,
  type = 'button',
  disabled,
  ariaLabel,
  strength = 0.18,
  onClick,
}: MagneticProps) {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null)

  const reset = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  const move = (event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (reducedMotion || disabled) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left - rect.width / 2) * strength
    const y = (event.clientY - rect.top - rect.height / 2) * strength
    event.currentTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  if (href && !disabled) {
    return (
      <motion.a
        ref={ref as Ref<HTMLAnchorElement>}
        className={className}
        href={href}
        target={target}
        rel={rel}
        download={download as string | undefined}
        aria-label={ariaLabel}
        onPointerMove={move}
        onPointerLeave={reset}
        whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as Ref<HTMLButtonElement>}
      className={className}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      onPointerMove={move}
      onPointerLeave={reset}
      whileTap={reducedMotion || disabled ? undefined : { scale: 0.97 }}
    >
      {children}
    </motion.button>
  )
}

type AnimatedCounterProps = {
  value: number
  suffix?: string
  label: string
}

export function AnimatedCounter({ value, suffix = '', label }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reducedMotion = useReducedMotion()
  const [display, setDisplay] = useState(reducedMotion ? value : 0)
  const displayValue = reducedMotion ? value : display

  useEffect(() => {
    if (!inView) return
    if (reducedMotion) return

    const duration = 900
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reducedMotion, value])

  return (
    <div ref={ref} className="metric-card">
      <div className="metric-value">
        {displayValue}
        {suffix}
      </div>
      <div className="metric-label">{label}</div>
    </div>
  )
}

type SectionHeadingProps = {
  kicker: string
  title: string
  accent?: string
  copy?: string
  align?: 'left' | 'center'
}

export function SectionHeading({
  kicker,
  title,
  accent,
  copy,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <SectionReveal className={`section-heading ${align === 'center' ? 'center' : ''}`}>
      <div className="section-kicker">{kicker}</div>
      <h2 className="section-title">
        {title}
        {accent ? <span>{accent}</span> : null}
      </h2>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </SectionReveal>
  )
}

export { AnimatePresence, motion, useReducedMotion }
