import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { neon } from '@neondatabase/serverless'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const sql = neon(process.env.DATABASE_URL!)

        const rows = await sql`
          SELECT id, email, "passwordHash" FROM admin_users WHERE email = ${credentials.email} LIMIT 1
        `
        if (rows.length === 0) return null

        const user = rows[0]
        const valid = await bcrypt.compare(credentials.password, user.passwordHash as string)
        if (!valid) return null

        return { id: user.id as string, email: user.email as string, name: 'Admin' }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 }, // 24 hour session
  pages: { signIn: '/admin/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.id as string
      return session
    },
  },
})

export { handler as GET, handler as POST }
