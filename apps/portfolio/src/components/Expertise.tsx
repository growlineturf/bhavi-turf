'use client'

import { ArrowUpRight, Layers } from 'lucide-react'
import { useState } from 'react'
import { expertise as fallbackExpertise, type Expertise as ExpertiseItem } from './data/fallback'
import { SectionReveal } from './ui/MotionPrimitives'

type Props = {
  items?: ExpertiseItem[]
}

export default function Expertise({ items }: Props) {
  const data = items && items.length ? items : fallbackExpertise
  const [open, setOpen] = useState(0)

  return (
    <section id="expertise" className="section">
      <div className="container">
        <SectionReveal>
          <h2 className="section-label" style={{ marginBottom: 30 }}>
            <span className="slash">/</span>EXPERTISE
          </h2>
        </SectionReveal>

        <div className="accordion">
          {data.map((item, index) => {
            const isOpen = open === index
            return (
              <div className={`acc-item ${isOpen ? 'open' : ''}`} key={item.title}>
                <button
                  type="button"
                  className="acc-head"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  aria-controls={`acc-panel-${index}`}
                >
                  <span className="acc-num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="acc-title">{item.title}</span>
                  <span className="acc-arrow" aria-hidden>
                    <ArrowUpRight size={24} />
                  </span>
                </button>

                <div className="acc-panel" id={`acc-panel-${index}`} role="region" aria-hidden={!isOpen}>
                  <div className="acc-panel-inner">
                    <div className="acc-card">
                      <div>
                        <p>{item.description}</p>
                        <div className="work-tags">
                          {item.tags.map((tag) => (
                            <span key={tag} className="chip">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="acc-visual" aria-hidden>
                        <div className="ph">
                          <Layers size={28} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
