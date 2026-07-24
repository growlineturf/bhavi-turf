'use client'

import { createAuthClient } from '@neondatabase/auth/next'

/** Client-side Neon Auth. Talks to the app's own /api/auth proxy route. */
export const authClient = createAuthClient()
