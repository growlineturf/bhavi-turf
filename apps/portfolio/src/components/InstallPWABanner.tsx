'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { X, Download, Share } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let deferredPrompt: any = null

export default function InstallPWABanner({ appName = 'BHAVI' }: { appName?: string }) {
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const [iosStep, setIosStep] = useState(false)
  const platformRef = useRef<'android' | 'ios' | null>(null)
  const canShowRef = useRef(false)

  const isDismissedRecently = () => {
    const d = localStorage.getItem('pwa-dismissed-at')
    if (!d) return false
    return Date.now() - Number(d) < 24 * 60 * 60 * 1000 // 24h cooldown
  }

  const doShow = useCallback(() => {
    setIosStep(false)
    setShow(true)
  }, [])

  const dismiss = useCallback(() => {
    setShow(false)
    localStorage.setItem('pwa-dismissed-at', String(Date.now()))
  }, [])

  useEffect(() => {
    // Already installed as PWA — never show
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as { standalone?: boolean }).standalone === true
    if (standalone) return

    const ua = navigator.userAgent
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isIOS = /iPhone|iPad|iPod/i.test(ua) && !(window as any).MSStream
    const isAndroid = /Android/i.test(ua)

    if (isIOS) {
      // Add to Home Screen only works in Safari on iOS
      const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)
      if (!isSafari) return
      platformRef.current = 'ios'
      canShowRef.current = true
      if (!isDismissedRecently()) {
        const t = setTimeout(doShow, 4000)
        return () => clearTimeout(t)
      }
    } else if (isAndroid) {
      platformRef.current = 'android'
      const handler = (e: Event) => {
        e.preventDefault()
        deferredPrompt = e
        canShowRef.current = true
        if (!isDismissedRecently()) {
          setTimeout(doShow, 4000)
        }
      }
      window.addEventListener('beforeinstallprompt', handler as EventListener)
      return () => window.removeEventListener('beforeinstallprompt', handler as EventListener)
    }
  }, [doShow])

  // Re-show when triggered externally (e.g. Book Now button)
  useEffect(() => {
    const handler = () => {
      if (canShowRef.current) doShow()
    }
    window.addEventListener('show-pwa-install', handler)
    return () => window.removeEventListener('show-pwa-install', handler)
  }, [doShow])

  const installAndroid = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      canShowRef.current = false
      deferredPrompt = null
      dismiss()
    }
  }

  // Skip on admin pages — admin has its own banner
  if (pathname?.startsWith('/admin')) return null
  if (!show) return null
  const platform = platformRef.current
  if (!platform) return null

  /* ── Android Banner ── */
  if (platform === 'android') {
    return (
      <div className="fixed bottom-20 left-3 right-3 z-[9999] flex items-center justify-between
                      gap-3 rounded-2xl bg-zinc-900 border border-zinc-700/80 px-4 py-3
                      shadow-2xl shadow-black/60 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-3 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt={appName}
            className="h-11 w-11 rounded-xl border border-zinc-700 object-contain p-0.5 shrink-0 bg-black" />
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate">{appName}</p>
            <p className="text-zinc-400 text-xs">Add to Home Screen for quick access</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={installAndroid}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95
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

  /* ── iOS Banner ── */
  return (
    <div className="fixed bottom-20 left-3 right-3 z-[9999] rounded-2xl bg-zinc-900
                    border border-zinc-700/80 p-4 shadow-2xl shadow-black/60
                    animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt={appName}
            className="h-11 w-11 rounded-xl border border-zinc-700 object-contain p-0.5 shrink-0 bg-black" />
          <div>
            <p className="text-white font-bold text-sm">{appName}</p>
            <p className="text-zinc-400 text-xs">Install for the best experience</p>
          </div>
        </div>
        <button onClick={dismiss} className="text-zinc-500 hover:text-zinc-300 transition p-1 shrink-0 mt-0.5">
          <X size={16} />
        </button>
      </div>

      {!iosStep ? (
        <button onClick={() => setIosStep(true)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500
                     active:scale-[0.98] text-white text-sm font-bold py-2.5 rounded-xl transition">
          <Share size={14} /> How to Add to Home Screen
        </button>
      ) : (
        <div className="space-y-2.5">
          <p className="text-zinc-300 text-xs font-semibold">In Safari, follow these steps:</p>
          <ol className="space-y-2 text-xs text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center
                               justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
              Tap the <strong className="text-white mx-1">Share</strong> button
              <Share size={12} className="text-zinc-300 shrink-0 mt-0.5 ml-0.5" />
              at the bottom of Safari
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center
                               justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
              Scroll down and tap <strong className="text-white">&ldquo;Add to Home Screen&rdquo;</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center
                               justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
              Tap <strong className="text-white">&ldquo;Add&rdquo;</strong> — done! ✅
            </li>
          </ol>
        </div>
      )}
    </div>
  )
}
