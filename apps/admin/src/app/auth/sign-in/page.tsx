'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { signInWithEmail } from './actions'

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null)

  return (
    <div className="auth-screen">
      <form action={formAction} className="auth-card" style={{ textAlign: 'left' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="auth-mark">AS</span>
          <h1>Admin sign in</h1>
          <p>Sign in to manage your portfolio content.</p>
        </div>

        <div className="form">
          <div className="field">
            <label className="field-label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" className="input" placeholder="you@email.com" />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" className="input" placeholder="••••••••" />
          </div>

          {state?.error && (
            <div className="save-status err" role="alert">{state.error}</div>
          )}

          <button type="submit" className="btn btn-dark" disabled={isPending} style={{ width: '100%' }}>
            {isPending ? <Loader2 size={16} className="spin" /> : null} Sign in
          </button>
        </div>

        <p style={{ marginTop: 18, marginBottom: 0, fontSize: '0.85rem' }}>
          First time here? <Link href="/auth/sign-up" style={{ fontWeight: 600, textDecoration: 'underline' }}>Create your admin account</Link>
        </p>
      </form>
    </div>
  )
}
