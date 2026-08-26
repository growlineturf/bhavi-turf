'use client'

import { useSession, signOut } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, useRef } from 'react'
import { Trophy, Clock, Calendar, Grid3x3, BarChart3, Settings, LogOut, X, Download, Share } from 'lucide-react'
import Link from 'next/link'

const NAV = [
  { href: '/admin',          label: 'Pending',  icon: Clock },
  { href: '/admin/today',    label: 'Today',    icon: Calendar },
  { href: '/admin/slots',    label: 'Slots',    icon: Grid3x3 },
  { href: '/admin/revenue',  label: 'Revenue',  icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

/* ── Admin PWA Install Banner ─────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let adminDeferredPrompt: any = null

function AdminInstallBanner() {
  const [show, setShow] = useState(false)
  const [iosStep, setIosStep] = useState(false)
  const platformRef = useRef<'android' | 'ios' | null>(null)
  const canShowRef = useRef(false)

  const isDismissed = () => !!localStorage.getItem('admin-pwa-dismissed')

  const doShow = useCallback(() => {
    setIosStep(false)
    setShow(true)
  }, [])

  const dismiss = useCallback(() => {
    setShow(false)
    localStorage.setItem('admin-pwa-dismissed', '1')
  }, [])

  useEffect(() => {
    if (isDismissed()) return
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as { standalone?: boolean }).standalone === true
    if (standalone) return

    const ua = navigator.userAgent
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isIOS = /iPhone|iPad|iPod/i.test(ua) && !(window as any).MSStream
    const isAndroid = /Android/i.test(ua)

    if (isIOS) {
      const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)
      if (!isSafari) return
      platformRef.current = 'ios'
      canShowRef.current = true
      const t = setTimeout(doShow, 3000)
      return () => clearTimeout(t)
    } else if (isAndroid) {
      platformRef.current = 'android'
      const handler = (e: Event) => {
        e.preventDefault()
        adminDeferredPrompt = e
        canShowRef.current = true
        setTimeout(doShow, 3000)
      }
      window.addEventListener('beforeinstallprompt', handler as EventListener)
      return () => window.removeEventListener('beforeinstallprompt', handler as EventListener)
    }
  }, [doShow])

  const installAndroid = async () => {
    if (!adminDeferredPrompt) return
    adminDeferredPrompt.prompt()
    const { outcome } = await adminDeferredPrompt.userChoice
    if (outcome === 'accepted') {
      adminDeferredPrompt = null
      canShowRef.current = false
      dismiss()
    }
  }

  if (!show) return null
  const platform = platformRef.current
  if (!platform) return null

  if (platform === 'android') {
    return (
      <div className="fixed top-3 left-3 right-3 z-[9999] flex items-center justify-between
                      gap-3 rounded-2xl bg-zinc-900 border border-blue-800/60 px-4 py-3
                      shadow-2xl shadow-black/60 animate-in slide-in-from-top-4 duration-300">
        <div className="flex items-center gap-3 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="BHAVI Admin"
            className="h-10 w-10 rounded-xl border border-zinc-700 object-contain p-0.5 shrink-0 bg-black" />
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate">BHAVI Admin</p>
            <p className="text-zinc-400 text-xs">Install the Admin App for easy access</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={installAndroid}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-600 active:scale-95
                       text-white text-xs font-bold px-3 py-2 rounded-xl transition">
            <Download size={13} /> Install
          </button>
          <button onClick={dismiss} className="text-zinc-500 hover:text-zinc-300 transition p-1">
            <X size={16} />
          </button>
        </div>
      </div>
    )
  }

  // iOS
  return (
    <div className="fixed top-3 left-3 right-3 z-[9999] rounded-2xl bg-zinc-900
                    border border-blue-800/60 p-4 shadow-2xl shadow-black/60
                    animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="BHAVI Admin"
            className="h-10 w-10 rounded-xl border border-zinc-700 object-contain p-0.5 shrink-0 bg-black" />
          <div>
            <p className="text-white font-bold text-sm">BHAVI Admin</p>
            <p className="text-zinc-400 text-xs">Install Admin App for quick access</p>
          </div>
        </div>
        <button onClick={dismiss} className="text-zinc-500 hover:text-zinc-300 transition p-1 shrink-0 mt-0.5">
          <X size={16} />
        </button>
      </div>
      {!iosStep ? (
        <button onClick={() => setIosStep(true)}
          className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600
                     active:scale-[0.98] text-white text-sm font-bold py-2.5 rounded-xl transition">
          <Share size={14} /> How to Install Admin App
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-zinc-300 text-xs font-semibold">In Safari, follow these steps:</p>
          <ol className="space-y-1.5 text-xs text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="bg-blue-700 text-white rounded-full w-4 h-4 flex items-center
                               justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
              Tap the <strong className="text-white mx-1">Share</strong> button
              <Share size={12} className="text-zinc-300 shrink-0 mt-0.5 ml-0.5" />
              at the bottom of Safari
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-700 text-white rounded-full w-4 h-4 flex items-center
                               justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
              Tap <strong className="text-white">&ldquo;Add to Home Screen&rdquo;</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-700 text-white rounded-full w-4 h-4 flex items-center
                               justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
              Tap <strong className="text-white">&ldquo;Add&rdquo;</strong> — done! ✅
            </li>
          </ol>
        </div>
      )}
    </div>
  )
}

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

      {/* Admin PWA install prompt — only for logged-in admins */}
      <AdminInstallBanner />

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
