'use client'

import { useState } from 'react'
import { Loader2, LogOut } from 'lucide-react'
import { authClient } from '@/lib/auth/client'

export default function SignOutButton({ className }: { className?: string }) {
  const [busy, setBusy] = useState(false)
  const onClick = async () => {
    setBusy(true)
    try {
      await authClient.signOut()
    } finally {
      window.location.href = '/auth/sign-in'
    }
  }
  return (
    <button type="button" className={className || 'btn btn-sm btn-danger'} onClick={onClick} disabled={busy}>
      {busy ? <Loader2 size={15} className="spin" /> : <LogOut size={15} />} Sign Out
    </button>
  )
}
