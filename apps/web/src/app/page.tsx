import { readFileSync } from 'fs'
import { join } from 'path'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Experience from '@/components/Experience'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

function getPortfolioData() {
  try {
    const raw = readFileSync(join(process.cwd(), 'public', 'data', 'portfolio.json'), 'utf-8')
    return JSON.parse(raw)
  } catch {
    // fallback — should not happen in normal operation
    return null
  }
}

export const dynamic = 'force-dynamic' // always re-render to get latest data

export default function Home() {
  const data = getPortfolioData()
  return (
    <>
      <Navbar />
      <main>
        <Hero profile={data?.profile} />
        <Marquee />
        <About />
        <Skills skills={data?.skills} />
        <Projects projects={data?.projects} />
        <Experience experience={data?.experience} certifications={data?.certifications} />
        <Contact profile={data?.profile} />
      </main>
      <Footer profile={data?.profile} />
    </>
  )
}
