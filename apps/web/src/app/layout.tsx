import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Abarna Sivakumar — AI & Full-Stack Developer',
  description: 'Portfolio of Abarna Sivakumar — AI & Data Science engineer building scalable full-stack applications with React, Python, and AWS.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Abarna Sivakumar — AI & Full-Stack Developer',
    description: 'Portfolio of Abarna Sivakumar — building intelligent, scalable digital products.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  keywords: ['Abarna Sivakumar', 'AI Developer', 'Full-Stack', 'React', 'Python', 'AWS'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#08080F" />
      </head>
      <body>{children}</body>
    </html>
  )
}
