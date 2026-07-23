import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import type { Metadata } from 'next'
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Github,
  Layers,
  Smartphone,
  Users,
} from 'lucide-react'
import { getProject, loadProjects } from '@/lib/projects'
import { projectSlug } from '@/components/data/fallback'
import ProjectGallery from './ProjectGallery'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const found = await getProject(slug)
  if (!found) return { title: 'Project not found' }
  const { project } = found
  return {
    title: `${project.title} — Abarna Sivakumar`,
    description: project.solution || project.description?.slice(0, 150) || project.title,
  }
}

function statusLabel(status?: string) {
  if (status === 'IN_PROGRESS') return 'In progress'
  if (status === 'ARCHIVED') return 'Archived'
  return 'Completed'
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params
  const found = await getProject(slug)
  if (!found) notFound()
  const { project, detail, github } = found

  const { projects } = await loadProjects()
  const others = projects.filter((item) => projectSlug(item.title) !== slug).slice(0, 2)

  // Prefer live DB values, fall back to the static case-study detail
  const timeline = (project.timeline?.length ? project.timeline : detail?.timeline) || []
  const team = (project.team?.length ? project.team : detail?.team) || []

  const proof: Array<[string, string | undefined]> = [
    ['Problem', project.problem],
    ['Solution', project.solution],
    ['Outcome', project.outcome],
  ]

  return (
    <>
      <header className="detail-topbar">
        <div className="container detail-topbar-inner">
          <Link href="/#work" className="pill">
            <ArrowLeft size={16} /> Back to Work
          </Link>
          <Link href="/#contact" className="pill dark">
            Hire Me <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>

      <main className="detail">
        <section className="container detail-hero">
          <div className="detail-meta">
            <span className="chip">{statusLabel(project.status)}</span>
            {project.year ? <span className="chip">{project.year}</span> : null}
            {project.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="detail-title">{project.title}</h1>
          {project.solution ? <p className="detail-lead">{project.solution}</p> : null}

          <div className="detail-cta">
            {project.githubUrl || github ? (
              <a className="pill dark lg" href={project.githubUrl || github} target="_blank" rel="noopener noreferrer">
                <Github size={17} /> View Code
              </a>
            ) : null}
            {project.playStoreUrl ? (
              <a className="pill lg" href={project.playStoreUrl} target="_blank" rel="noopener noreferrer">
                <Smartphone size={16} /> Google Play
              </a>
            ) : null}
            {(detail?.liveUrl || project.liveUrl) ? (
              <a
                className="pill lg"
                href={detail?.liveUrl || project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Preview <ArrowUpRight size={16} />
              </a>
            ) : null}
          </div>
        </section>

        <section className="container detail-gallery-wrap">
          <ProjectGallery
            title={project.title}
            images={project.imageUrls?.length ? project.imageUrls : project.thumbnailUrl ? [project.thumbnailUrl] : []}
            placeholders={detail?.gallery || 3}
          />
        </section>

        <section className="container detail-body">
          <div className="detail-main">
            {project.description ? (
              <div className="detail-block">
                <h2 className="detail-h2">Overview</h2>
                <div className="modal-prose">
                  <ReactMarkdown>{project.description}</ReactMarkdown>
                </div>
              </div>
            ) : null}

            <div className="detail-block">
              <h2 className="detail-h2">How it came together</h2>
              <div className="proof-grid detail-proof">
                {proof
                  .filter(([, value]) => Boolean(value))
                  .map(([label, value]) => (
                    <div key={label} className="proof-card">
                      <span className="k">{label}</span>
                      <p>{value}</p>
                    </div>
                  ))}
              </div>
            </div>

            {timeline.length ? (
              <div className="detail-block">
                <h2 className="detail-h2">
                  <CalendarDays size={20} /> Project timeline
                </h2>
                <ol className="timeline">
                  {timeline.map((phase) => (
                    <li key={phase.phase} className="timeline-item">
                      <span className="timeline-node" aria-hidden />
                      <div className="timeline-content">
                        <div className="timeline-head">
                          <h3>{phase.phase}</h3>
                          <span className="timeline-period">{phase.period}</span>
                        </div>
                        <p>{phase.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>

          <aside className="detail-side">
            {project.role ? (
              <div className="side-card">
                <span className="k">Role</span>
                <p>{project.role}</p>
              </div>
            ) : null}

            <div className="side-card">
              <span className="k">
                <Layers size={15} /> Tech stack
              </span>
              <div className="work-tags">
                {project.techStack.map((tech) => (
                  <span key={tech} className="chip mini">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {team.length ? (
              <div className="side-card">
                <span className="k">
                  <Users size={15} /> Team
                </span>
                <div className="team-list">
                  {team.map((member) => (
                    <div key={member.name} className="team-member">
                      <span className="team-ava">
                        {member.name
                          .split(' ')
                          .map((p) => p[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <div>
                        <strong>{member.name}</strong>
                        <span>{member.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {project.metricHighlights?.length ? (
              <div className="side-card">
                <span className="k">Highlights</span>
                <ul className="side-metrics">
                  {project.metricHighlights.map((metric) => (
                    <li key={metric}>{metric}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </section>

        {others.length ? (
          <section className="container detail-next">
            <h2 className="detail-h2">More work</h2>
            <div className="detail-next-grid">
              {others.map((item) => (
                <Link key={item.title} href={`/work/${projectSlug(item.title)}`} className="panel next-card">
                  <div className="next-card-body">
                    <span className="k">{item.tags?.[0] || 'Project'}</span>
                    <h3>{item.title}</h3>
                  </div>
                  <span className="iconbtn">
                    <ArrowUpRight size={18} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </>
  )
}
