import { getPublicPortfolio } from '@portfolio/cms'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Projects from '@/components/Projects'
import Expertise from '@/components/Expertise'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Certifications from '@/components/Certifications'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { MotionShell } from '@/components/ui/MotionPrimitives'
import {
  expertise,
  fallbackExperience,
  fallbackProfile,
  fallbackProjects,
} from '@/components/data/fallback'

async function loadPortfolioData() {
  try {
    return await getPublicPortfolio('abarna')
  } catch {
    return null
  }
}

export const dynamic = 'force-dynamic' // always re-render to get latest CMS data

export default async function Home() {
  const data = await loadPortfolioData()

  const profile = data?.profile
  const openToWork = profile?.openToWork ?? fallbackProfile.openToWork
  const availabilityText = profile?.availabilityText || fallbackProfile.availabilityText

  const counts = {
    work: data?.projects?.length || fallbackProjects.length,
    expertise: expertise.length,
    experience: data?.experience?.length || fallbackExperience.length,
  }

  return (
    <MotionShell>
      <Navbar openToWork={openToWork} availabilityText={availabilityText} counts={counts} />
      <main>
        <Hero profile={profile} />
        <Marquee />
        <Projects projects={data?.projects} githubUrl={profile?.github} />
        <Expertise />
        <Skills skills={data?.skills} />
        <Experience experience={data?.experience} education={data?.education} />
        <Certifications certifications={data?.certifications} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </MotionShell>
  )
}
