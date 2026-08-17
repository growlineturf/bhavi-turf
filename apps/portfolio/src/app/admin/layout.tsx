import type { Metadata } from 'next'
import AdminShell from './AdminShell'

// Override root layout's manifest/appleWebApp for all /admin/* routes
export const metadata: Metadata = {
  title: 'Turf Admin',
  manifest: '/admin-manifest.json',
  appleWebApp: {
    title: 'Turf Admin',
    capable: true,
    statusBarStyle: 'black-translucent',
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
