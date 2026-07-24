'use server'

import { redirect } from 'next/navigation'
import { auth, isAllowedAdmin } from '@/lib/auth/server'

export async function signUpWithEmail(_prev: { error: string } | null, formData: FormData) {
  if (!auth) redirect('/')

  const email = String(formData.get('email') || '').trim()
  const name = String(formData.get('name') || '').trim()
  const password = String(formData.get('password') || '')

  if (!email || !password) return { error: 'Enter your email and password.' }
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' }

  // Only allowlisted emails may create an admin account.
  if (!isAllowedAdmin(email)) return { error: 'This email is not authorised for admin access.' }

  const { error } = await auth.signUp.email({ email, name: name || email, password })
  if (error) return { error: error.message || 'Could not create the account.' }

  redirect('/')
}
