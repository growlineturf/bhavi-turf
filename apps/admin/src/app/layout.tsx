import type { Metadata } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: 'Portfolio Admin',
  description: 'Admin CMS for the Abarna Sivakumar portfolio.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
