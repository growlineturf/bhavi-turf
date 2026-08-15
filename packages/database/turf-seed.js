const path = require('path');

// Point to pnpm virtual store
const neonPkg = path.join(__dirname, '../../node_modules/.pnpm/@neondatabase+serverless@1.1.0/node_modules/@neondatabase/serverless');
const bcryptPkg = path.join(__dirname, '../../node_modules/.pnpm/bcryptjs@3.0.3/node_modules/bcryptjs');

const { neon } = require(neonPkg);
const bcrypt = require(bcryptPkg);

const DB_URL = 'postgresql://neondb_owner:npg_sPD7w5lBqpZN@ep-patient-art-azlzvwog-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = neon(DB_URL);

async function seed() {
  const hash = await bcrypt.hash('Turf@2026', 10);

  await sql`
    INSERT INTO admin_users (id, email, "passwordHash", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), 'admin@turfarena.in', ${hash}, now(), now())
    ON CONFLICT (email) DO UPDATE SET "passwordHash" = ${hash}, "updatedAt" = now()
  `;
  console.log('✅ Admin user: admin@turfarena.in / Turf@2026');

  await sql`
    INSERT INTO settings (id, "turfName", city, "whatsappNumber", "gpayNumber", "advanceAmount", "heroTitle", "heroTagline", "heroBannerUrl", "updatedAt")
    VALUES ('singleton', 'Turf Arena', 'Chennai, Tamil Nadu', '', '', 500, 'Book Your Slot', 'Premium Turf Experience', '', now())
    ON CONFLICT (id) DO NOTHING
  `;
  console.log('✅ Settings seeded');
}

seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
