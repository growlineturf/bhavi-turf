'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { signUpWithEmail } from './actions'

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUpWithEmail, null)

  return (
    <div className="auth-screen">
      <form action={formAction} className="auth-card" style={{ textAlign: 'left' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="auth-mark">AS</span>
          <h1>Create admin account</h1>
          <p>One-time setup for the portfolio owner.</p>
        </div>

        <div className="form">
          <div className="field">
            <label className="field-label" htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required autoComplete="name" className="input" placeholder="Abarna Sivakumar" />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" className="input" placeholder="you@email.com" />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required autoComplete="new-password" minLength={8} className="input" placeholder="At least 8 characters" />
          </div>

          {state?.error && (
            <div className="save-status err" role="alert">{state.error}</div>
          )}

          <button type="submit" className="btn btn-dark" disabled={isPending} style={{ width: '100%' }}>
            {isPending ? <Loader2 size={16} className="spin" /> : null} Create account
          </button>
        </div>

        <p style={{ marginTop: 18, marginBottom: 0, fontSize: '0.85rem' }}>
          Already have an account? <Link href="/auth/sign-in" style={{ fontWeight: 600, textDecoration: 'underline' }}>Sign in</Link>
        </p>
      </form>
    </div>
  )
}
