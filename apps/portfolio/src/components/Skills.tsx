'use client'

import type { CSSProperties } from 'react'
import type { Skill } from './portfolio-types'
import { fallbackSkills, techLogoSlug } from './data/fallback'
import { SectionReveal, motion, useReducedMotion } from './ui/MotionPrimitives'

type Props = {
  skills?: Skill[]
}

const groupOrder: Array<{ key: Skill['category']; label: string }> = [
  { key: 'LANGUAGE', label: 'Languages' },
  { key: 'FRAMEWORK', label: 'Frameworks' },
  { key: 'DATABASE', label: 'Databases' },
  { key: 'CLOUD', label: 'Cloud' },
  { key: 'TOOL', label: 'Tools' },
  { key: 'OTHER', label: 'Other' },
]

function SkillCard({ skill }: { skill: Skill }) {
  const reduced = useReducedMotion()
  const slug = techLogoSlug(skill.name)

  return (
    <div className="skill-card">
      <div className="skill-card-top">
        <span className="skill-logo">
          {slug ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={`/logos/${slug}.svg`} alt="" width={18} height={18} />
          ) : (
            <span className="skill-mono">{skill.name.charAt(0)}</span>
          )}
        </span>
        <span className="skill-name">{skill.name}</span>
        <span className="skill-pct">{skill.proficiency}%</span>
      </div>
      <div
        className="skill-bar"
        role="progressbar"
        aria-valuenow={skill.proficiency}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency`}
      >
        <motion.span
          className="skill-bar-fill"
          style={{ transformOrigin: 'left', '--p': skill.proficiency / 100 } as CSSProperties}
          initial={reduced ? { scaleX: skill.proficiency / 100 } : { scaleX: 0 }}
          whileInView={reduced ? undefined : { scaleX: skill.proficiency / 100 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

export default function Skills({ skills }: Props) {
  const source = skills && skills.length ? skills : fallbackSkills

  const groups = groupOrder
    .map((group) => ({ ...group, items: source.filter((s) => s.category === group.key) }))
    .filter((group) => group.items.length > 0)

  const avg = Math.round(source.reduce((sum, s) => sum + s.proficiency, 0) / source.length)

  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-topline">
            <h2 className="section-label">
              <span className="slash">/</span>TOOLBOX
            </h2>
            <span className="section-sub">
              {source.length} technologies · {avg}% avg proficiency
            </span>
          </div>
        </SectionReveal>

        <div className="toolbox-groups">
          {groups.map((group, gi) => (
            <SectionReveal key={group.key} delay={gi * 0.05} className="skill-group">
              <div className="skill-group-head">
                <span className="skill-group-label">{group.label}</span>
                <span className="skill-group-count">{group.items.length}</span>
                <span className="skill-group-line" aria-hidden />
              </div>
              <div className="skill-cards">
                {group.items.map((skill) => (
                  <SkillCard key={skill.id || skill.name} skill={skill} />
                ))}
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
