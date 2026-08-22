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

export default function AdminShell({ children }: { children: React.ReactNode }) {
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

  // Override PWA manifest + iOS title so "Add to Home Screen" installs as "BHAVI Admin"
  useEffect(() => {
    // Swap manifest link to admin manifest
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null
    if (!manifestLink) {
      manifestLink = document.createElement('link')
      manifestLink.rel = 'manifest'
      document.head.appendChild(manifestLink)
    }
    const prevManifest = manifestLink.href
    manifestLink.href = '/api/manifest/admin'

    // Swap apple-mobile-web-app-title for iOS
    let appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]') as HTMLMetaElement | null
    if (!appleTitle) {
      appleTitle = document.createElement('meta')
      appleTitle.name = 'apple-mobile-web-app-title'
      document.head.appendChild(appleTitle)
    }
    const prevAppleTitle = appleTitle.content
    appleTitle.content = 'BHAVI Admin'

    return () => {
      // Restore consumer values on unmount
      if (manifestLink) manifestLink.href = prevManifest
      if (appleTitle) appleTitle.content = prevAppleTitle
    }
  }, [])

  // Fetch pending count on mount, tab-focus, route change, and after any booking action
  useEffect(() => {
    if (status !== 'authenticated') return
    const fetchPending = () =>
      Promise.all([
        fetch('/api/bookings?status=pending_payment').then(r => r.json()).catch(() => []),
        fetch('/api/bookings/fiveover').then(r => r.json()).catch(() => []),
      ]).then(([normal, fiveOver]) => {
        const normalCount   = Array.isArray(normal)   ? normal.length   : 0
        const fiveOverCount = Array.isArray(fiveOver)
          ? fiveOver.filter((b: { status: string }) => b.status === 'pending_payment').length
          : 0
        setPendingCount(normalCount + fiveOverCount)
      })

    fetchPending()

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchPending()
    }
    // Re-fetch whenever any booking is confirmed / rejected
    const handleAction = () => fetchPending()

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('bookingActioned', handleAction)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('bookingActioned', handleAction)
    }
  }, [status, pathname])   // pathname: re-fetch on every tab switch

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
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
            <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="BHAVI TURF" className="h-full w-full object-contain p-0.5" />
            </div>
            <div>
              <div className="font-black text-sm text-white">BHAVI TURF</div>
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

      {/* Mobile bottom tab bar */}
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
