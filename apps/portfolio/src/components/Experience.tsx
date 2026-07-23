'use client'

import { GraduationCap } from 'lucide-react'
import type { EducationItem, ExperienceItem } from './portfolio-types'
import { fallbackEducation, fallbackExperience } from './data/fallback'
import { SectionReveal } from './ui/MotionPrimitives'

type Props = {
  experience?: ExperienceItem[]
  education?: EducationItem[]
}

function earliestYear(items: ExperienceItem[]) {
  const years = items
    .flatMap((item) => (item.period ? item.period.match(/\d{4}/g) || [] : []))
    .map(Number)
    .filter(Boolean)
  return years.length ? Math.min(...years) : null
}

export default function Experience({ experience, education }: Props) {
  const roles = experience && experience.length ? experience : fallbackExperience
  const edu = education && education.length ? education : fallbackEducation
  const startYear = earliestYear(roles)

  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionReveal className="xp-card">
          <span className="xp-ghost" aria-hidden>
            EXPERIENCE
          </span>

          <div className="xp-top">
            <h2>
              <span className="slash">/</span>EXPERIENCE
            </h2>
            <span className="xp-years">
              {startYear ? `${startYear} – Present` : 'Internships & real-world builds'}
            </span>
          </div>

          <div className="xp-list">
            {roles.map((item) => (
              <div className="xp-row" key={item.id || `${item.company}-${item.role}`}>
                <div>
                  <p className="xp-company">{item.company}</p>
                  <p className="xp-role">{item.role}</p>
                </div>
                <span className="xp-dates">{item.period || item.type || ''}</span>
                <div className="xp-preview" aria-hidden>
                  <div className="ph">
                    <GraduationCap size={26} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="xp-sub">
            {edu.map((item) => (
              <div className="xp-sub-card" key={item.id || item.institution}>
                <span className="k">
                  <GraduationCap size={15} /> Education
                </span>
                <h4>{item.degree}</h4>
                <p>{[item.institution, item.grade, item.period].filter(Boolean).join(' · ')}</p>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
