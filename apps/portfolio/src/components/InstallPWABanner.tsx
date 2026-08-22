'use client'

import { useEffect, useState } from 'react'
import { X, Download, Share } from 'lucide-react'

type Platform = 'android' | 'ios' | null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let deferredPrompt: any = null

export default function InstallPWABanner({ appName = 'BHAVI' }: { appName?: string }) {
  const [platform, setPlatform] = useState<Platform>(null)
  const [show, setShow] = useState(false)
  const [iosStep, setIosStep] = useState(false)

  useEffect(() => {
    // Don't show if already installed / dismissed
    if (localStorage.getItem('pwa-dismissed')) return
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as { standalone?: boolean }).standalone === true
    if (isStandalone) return

    const ua = navigator.userAgent
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isIOS = /iPhone|iPad|iPod/i.test(ua) && !(window as any).MSStream
    const isAndroid = /Android/i.test(ua)

    if (isIOS) {
      // Only show in Safari (not Chrome/Firefox on iOS)
      const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)
      if (isSafari) { setPlatform('ios'); setShow(true) }
    } else if (isAndroid) {
      // Wait for Chrome's beforeinstallprompt
      const handler = (e: Event) => {
        e.preventDefault()
        deferredPrompt = e
        setPlatform('android')
        setShow(true)
      }
      window.addEventListener('beforeinstallprompt', handler as EventListener)
      return () => window.removeEventListener('beforeinstallprompt', handler as EventListener)
    }
  }, [])

  const dismiss = () => {
    setShow(false)
    localStorage.setItem('pwa-dismissed', '1')
  }

  const installAndroid = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') { dismiss(); deferredPrompt = null }
  }

  if (!show) return null

  /* ── Android Banner ── */
  if (platform === 'android') {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-[9999] flex items-center justify-between
                      gap-3 rounded-2xl bg-zinc-900 border border-zinc-700 px-4 py-3 shadow-2xl
                      animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white text-lg font-black">B</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">{appName}</p>
            <p className="text-zinc-400 text-xs">Add to Home Screen for quick access</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={installAndroid}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition">
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
    <div className="fixed bottom-4 left-4 right-4 z-[9999] rounded-2xl bg-zinc-900 border border-zinc-700 p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white text-lg font-black">B</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">{appName}</p>
            <p className="text-zinc-400 text-xs">Install for the best experience</p>
          </div>
        </div>
        <button onClick={dismiss} className="text-zinc-500 hover:text-zinc-300 transition p-1 shrink-0">
          <X size={16} />
        </button>
      </div>
      {!iosStep ? (
        <button onClick={() => setIosStep(true)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2.5 rounded-xl transition">
          <Share size={14} /> Add to Home Screen
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-zinc-300 text-xs font-semibold">Follow these steps:</p>
          <ol className="space-y-1.5 text-xs text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
              Tap the <strong className="text-white mx-1">Share</strong> button at the bottom of Safari
              <Share size={12} className="text-zinc-300 shrink-0 mt-0.5" />
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
              Scroll down and tap <strong className="text-white">&ldquo;Add to Home Screen&rdquo;</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
              Tap <strong className="text-white">&ldquo;Add&rdquo;</strong> — done! ✅
            </li>
          </ol>
        </div>
      )}
    </div>
  )
}
