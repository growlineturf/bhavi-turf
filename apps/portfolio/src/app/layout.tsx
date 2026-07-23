import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Poppins } from 'next/font/google'
import { getPublicPortfolio } from '@portfolio/cms'
import { fallbackProfile } from '@/components/data/fallback'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'http://localhost:3000'

  let profile = {
    name: fallbackProfile.name,
    title: fallbackProfile.title,
    tagline: fallbackProfile.tagline,
    summary: fallbackProfile.summary,
    avatarUrl: fallbackProfile.avatarUrl,
  }

  try {
    const data = await getPublicPortfolio('abarna')
    profile = {
      name: data.profile.name,
      title: data.profile.title,
      tagline: data.profile.tagline,
      summary: data.profile.summary,
      avatarUrl: data.profile.avatarUrl,
    }
  } catch {
    // fall back to static profile above
  }

  const title = `${profile.name} — ${profile.title}`
  const description = profile.tagline || profile.summary

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      type: 'website',
      images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : undefined,
    },
    twitter: { card: 'summary_large_image' },
    keywords: [profile.name, profile.title, 'AI Developer', 'Full-Stack Developer', 'React', 'Python', 'AWS', 'Hire'],
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={poppins.variable}>
      <head>
        <meta name="theme-color" content="#eef0f3" />
      </head>
      <body>
        <div className="cloud-bg" aria-hidden />
        <div className="site-shell">{children}</div>
      </body>
    </html>
  )
}
