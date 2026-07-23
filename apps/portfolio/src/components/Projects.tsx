'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Project } from './portfolio-types'
import { fallbackProfile, fallbackProjects, projectSlug, techLogoSlug } from './data/fallback'
import { SectionReveal } from './ui/MotionPrimitives'

type Props = {
  projects?: Project[]
  githubUrl?: string
}

type Sort = 'featured' | 'newest' | 'az'

function projectImage(project: Project) {
  return project.thumbnailUrl || project.imageUrls?.[0] || ''
}

function initials(title: string) {
  return (
    title
      .split(/[\s—-]+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'PR'
  )
}

export default function Projects({ projects: propProjects, githubUrl }: Props) {
  const source = propProjects && propProjects.length ? propProjects : fallbackProjects
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState<Sort>('featured')
  const github = githubUrl || fallbackProfile.github

  const tabs = useMemo(() => {
    const tags = new Set<string>()
    source.forEach((p) => p.tags?.slice(0, 2).forEach((t) => tags.add(t)))
    return ['All', ...Array.from(tags).slice(0, 4)]
  }, [source])

  const visible = useMemo(() => {
    const filtered = filter === 'All' ? source : source.filter((p) => p.tags?.includes(filter))
    const sorted = [...filtered]
    if (sort === 'az') sorted.sort((a, b) => a.title.localeCompare(b.title))
    else if (sort === 'newest') sorted.sort((a, b) => Number(b.year || 0) - Number(a.year || 0))
    else
      sorted.sort(
        (a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          Number(b.year || 0) - Number(a.year || 0),
      )
    return sorted
  }, [source, filter, sort])

  return (
    <section id="work" className="section">
      <div className="container">
        <SectionReveal className="ghost-head">
          <span className="ghost-word">PORTFOLIO</span>
          <h2 className="section-label">
            <span className="slash">/</span>SELECTED WORK
          </h2>
        </SectionReveal>

        <SectionReveal className="work-toolbar">
          <div className="work-filters" role="tablist" aria-label="Filter projects">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={filter === tab}
                className={`tab ${filter === tab ? 'active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="work-tools">
            <span className="work-count">
              {visible.length} {visible.length === 1 ? 'project' : 'projects'}
            </span>
            <label className="sort">
              <span>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort projects">
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="az">A–Z</option>
              </select>
            </label>
          </div>
        </SectionReveal>

        <div className="work-grid">
          {visible.map((project, index) => {
            const image = projectImage(project)
            const href = `/work/${projectSlug(project.title)}`
            const category = project.tags?.[0] || 'Project'
            const logos = (project.techStack || [])
              .map((t) => ({ name: t, slug: techLogoSlug(t) }))
              .filter((t) => t.slug)
              .slice(0, 5)
            return (
              <SectionReveal key={project.id || project.title} delay={index * 0.06}>
                <article className="work-card2">
                  <Link href={href} className={`work-cover ${image ? 'has-img' : 'no-img'}`} aria-label={`View ${project.title}`}>
                    <span className="work-index">{String(index + 1).padStart(2, '0')}</span>
                    {project.featured ? (
                      <span className="work-featured">
                        <Star size={12} /> Featured
                      </span>
                    ) : null}

                    {image ? (
                      <Image src={image} alt={`${project.title} preview`} fill sizes="(max-width: 900px) 100vw, 560px" />
                    ) : (
                      <div className="cover-art">
                        <span className="cover-cat">{category}</span>
                        <span className="cover-mark">{initials(project.title)}</span>
                        {logos.length ? (
                          <div className="cover-logos">
                            {logos.map((t) => (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img key={t.name} src={`/logos/${t.slug}.svg`} alt={t.name} title={t.name} width={22} height={22} />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )}

                    <span className="cover-go" aria-hidden>
                      <ArrowUpRight size={22} />
                    </span>
                  </Link>

                  <div className="work-info">
                    <div className="work-info-top">
                      <span className="chip mini">{category}</span>
                      {project.year ? <span className="work-year">{project.year}</span> : null}
                    </div>
                    <Link href={href} className="work-title-link">
                      <h3>{project.title}</h3>
                    </Link>
                    <p>{project.outcome || project.solution || project.description?.slice(0, 120)}</p>
                    <div className="work-tags">
                      {project.techStack?.slice(0, 4).map((tech) => (
                        <span key={tech} className="chip mini">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link href={href} className="work-cta">
                      View case study <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              </SectionReveal>
            )
          })}
        </div>

        <SectionReveal className="work-footer">
          <a className="pill" href={github} target="_blank" rel="noopener noreferrer">
            View all on GitHub <ArrowUpRight size={16} />
          </a>
        </SectionReveal>
      </div>
    </section>
  )
}
