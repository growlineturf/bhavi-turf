'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Trophy, Clock, Calendar, Grid3x3, BarChart3, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

const NAV = [
  { href: '/admin', label: 'Pending', icon: Clock },
  { href: '/admin/today', label: 'Today', icon: Calendar },
  { href: '/admin/slots', label: 'Slots', icon: Grid3x3 },
  { href: '/admin/revenue', label: 'Revenue', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    fetch('/api/bookings?status=pending_payment')
      .then(r => r.json())
      .then(d => setPendingCount(Array.isArray(d) ? d.length : 0))
      .catch(() => {})
    const iv = setInterval(() => {
      fetch('/api/bookings?status=pending_payment')
        .then(r => r.json())
        .then(d => setPendingCount(Array.isArray(d) ? d.length : 0))
        .catch(() => {})
    }, 30000)
    return () => clearInterval(iv)
  }, [])

  if (status === 'loading' || status === 'unauthenticated') {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-56 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 flex md:flex-col p-3 md:p-4 gap-1 md:gap-1 overflow-x-auto md:overflow-visible">
        {/* Logo - desktop only */}
        <div className="hidden md:flex items-center gap-3 px-2 py-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Trophy size={16} className="text-white" />
          </div>
          <div>
            <div className="font-black text-sm text-white">Turf Arena</div>
            <div className="text-xs text-zinc-500">Admin</div>
          </div>
        </div>

        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          const isPending = href === '/admin'
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${
                active ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}>
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
              {isPending && pendingCount > 0 && (
                <span className={`ml-auto text-xs font-black px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-blue-600 text-white'}`}>
                  {pendingCount}
                </span>
              )}
            </Link>
          )
        })}

        <button onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition md:mt-auto flex-shrink-0">
          <LogOut size={16} /><span className="hidden sm:inline">Sign Out</span>
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
