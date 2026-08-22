const { neon } = require('@neondatabase/serverless')
const bcrypt = require('bcryptjs')

// Load DATABASE_URL from .env.local if present (requires dotenv or manual export)
const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set.')
  console.error('   Set it before running: $env:DATABASE_URL="postgresql://..."')
  process.exit(1)
}

async function seedAdmin() {
  const sql = neon(DATABASE_URL)

  // Check if admin_users table exists
  try {
    const existing = await sql`SELECT id, email FROM admin_users LIMIT 5`
    console.log('Existing admin users:', existing)

    if (existing.length === 0) {
      // Hash the password
      const hash = await bcrypt.hash('Turf@2026', 12)
      
      // Insert admin user
      await sql`
        INSERT INTO admin_users (id, email, "passwordHash", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), 'admin@turfarena.in', ${hash}, now(), now())
        ON CONFLICT (email) DO UPDATE SET "passwordHash" = ${hash}
      `
      console.log('✅ Admin user created: admin@turfarena.in / Turf@2026')
    } else {
      console.log('Admin users already exist. Updating password...')
      const hash = await bcrypt.hash('Turf@2026', 12)
      await sql`UPDATE admin_users SET "passwordHash" = ${hash} WHERE email = 'admin@turfarena.in'`
      console.log('✅ Password updated for admin@turfarena.in')
    }
  } catch (err) {
    console.error('Error:', err.message)
    // Try creating the table if it doesn't exist
    console.log('Attempting to create admin_users table...')
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email TEXT UNIQUE NOT NULL,
        "passwordHash" TEXT NOT NULL,
        "createdAt" TIMESTAMPTZ DEFAULT now(),
        "updatedAt" TIMESTAMPTZ DEFAULT now()
      )
    `
    const hash = await bcrypt.hash('Turf@2026', 12)
    await sql`
      INSERT INTO admin_users (id, email, "passwordHash")
      VALUES (gen_random_uuid()::text, 'admin@turfarena.in', ${hash})
      ON CONFLICT (email) DO UPDATE SET "passwordHash" = ${hash}
    `
    console.log('✅ Table created and admin user inserted')
  }
}

seedAdmin().catch(console.error)
