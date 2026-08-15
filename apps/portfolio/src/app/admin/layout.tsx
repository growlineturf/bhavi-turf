'use client'

import { useSession, signOut } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Trophy, Clock, Calendar, Grid3x3, BarChart3, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

const NAV = [
  { href: '/admin',          label: 'Pending',  icon: Clock },
  { href: '/admin/today',    label: 'Today',    icon: Calendar },
  { href: '/admin/slots',    label: 'Slots',    icon: Grid3x3 },
  { href: '/admin/revenue',  label: 'Revenue',  icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [pendingCount, setPendingCount] = useState(0)
  const [isMobile, setIsMobile] = useState(true) // mobile-first default

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (status !== 'authenticated') return
    const fetchPending = () =>
      fetch('/api/bookings?status=pending_payment')
        .then(r => r.json())
        .then(d => setPendingCount(Array.isArray(d) ? d.length : 0))
        .catch(() => {})
    fetchPending()
    const iv = setInterval(fetchPending, 30000)
    return () => clearInterval(iv)
  }, [status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    // Show login page as-is; redirect everything else to login
    if (pathname === '/admin/login') return <>{children}</>
    router.replace('/admin/login')
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-row">

      {/* Desktop sidebar — shown only on wide screens */}
      {!isMobile && (
        <aside className="w-56 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col p-4 gap-1">
          <div className="flex items-center gap-3 px-2 py-3 mb-4">
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
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}>
                <Icon size={16} />
                <span>{label}</span>
                {isPending && pendingCount > 0 && (
                  <span className={`ml-auto text-xs font-black px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-blue-600 text-white'}`}>
                    {pendingCount}
                  </span>
                )}
              </Link>
            )
          })}

          <button onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition mt-auto">
            <LogOut size={16} /><span>Sign Out</span>
          </button>
        </aside>
      )}

      {/* Page content */}
      <main
        className="flex-1 min-w-0 p-4 overflow-auto"
        style={{ paddingBottom: isMobile ? '80px' : '24px' }}
      >
        {children}
      </main>

      {/* Mobile bottom tab bar — fixed at bottom, shown only on small screens */}
      {isMobile && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-800 flex items-stretch justify-around"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 4px)' }}
        >
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            const isPending = href === '/admin'
            return (
              <Link key={href} href={href}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors ${
                  active ? 'text-blue-400' : 'text-zinc-500'
                }`}>
                <div className="relative">
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                  {isPending && pendingCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 text-[9px] font-black bg-red-500 text-white min-w-[16px] h-4 rounded-full flex items-center justify-center px-0.5">
                      {pendingCount > 9 ? '9+' : pendingCount}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-semibold tracking-wide">{label}</span>
              </Link>
            )
          })}
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-zinc-600 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} strokeWidth={1.8} />
            <span className="text-[9px] font-semibold tracking-wide">Logout</span>
          </button>
        </nav>
      )}

    </div>
  )
}
