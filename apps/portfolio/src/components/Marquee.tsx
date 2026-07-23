'use client'

type Tech = { name: string; slug: string }

const ROW_ONE: Tech[] = [
  { name: 'React', slug: 'react' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'JavaScript', slug: 'javascript' },
  { name: 'Python', slug: 'python' },
  { name: 'Java', slug: 'openjdk' },
  { name: 'Next.js', slug: 'nextdotjs' },
  { name: 'Node.js', slug: 'nodedotjs' },
  { name: 'Flutter', slug: 'flutter' },
  { name: 'Dart', slug: 'dart' },
  { name: 'HTML5', slug: 'html5' },
  { name: 'Tailwind CSS', slug: 'tailwindcss' },
  { name: 'GraphQL', slug: 'graphql' },
]

const ROW_TWO: Tech[] = [
  { name: 'AWS', slug: 'amazonwebservices' },
  { name: 'Firebase', slug: 'firebase' },
  { name: 'PostgreSQL', slug: 'postgresql' },
  { name: 'MySQL', slug: 'mysql' },
  { name: 'Redis', slug: 'redis' },
  { name: 'Prisma', slug: 'prisma' },
  { name: 'Docker', slug: 'docker' },
  { name: 'Git', slug: 'git' },
  { name: 'GitHub', slug: 'github' },
  { name: 'Express', slug: 'express' },
  { name: 'Vercel', slug: 'vercel' },
  { name: 'Gemini', slug: 'googlegemini' },
  { name: 'Figma', slug: 'figma' },
]

function Row({ items, reverse }: { items: Tech[]; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className={`marquee ${reverse ? 'marquee-reverse' : ''}`}>
      <div className="marquee-track">
        {doubled.map((tech, index) => (
          <div className="marquee-pill" key={`${tech.slug}-${index}`} aria-hidden={index >= items.length}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="marquee-logo" src={`/logos/${tech.slug}.svg`} alt="" width={20} height={20} loading="lazy" />
            <span>{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Marquee() {
  return (
    <section className="marquee-wrap" aria-label="Technologies I work with">
      <Row items={ROW_ONE} />
      <Row items={ROW_TWO} reverse />
    </section>
  )
}
