'use server'

import { redirect } from 'next/navigation'
import { getAuth } from '@/lib/auth/server'

export async function signInWithEmail(_prev: { error: string } | null, formData: FormData) {
  const auth = getAuth()
  if (!auth) redirect('/')

  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  if (!email || !password) return { error: 'Enter your email and password.' }

  const { error } = await auth.signIn.email({ email, password })
  if (error) return { error: error.message || 'Incorrect email or password.' }

  redirect('/')
}
