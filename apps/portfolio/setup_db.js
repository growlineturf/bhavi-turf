const { neon } = require('@neondatabase/serverless')

const DATABASE_URL = "postgresql://neondb_owner:npg_9Sy6UlGgNaIO@ep-floral-base-azn24vyf-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

async function removeFootball() {
  const sql = neon(DATABASE_URL)

  // Update settings
  await sql`UPDATE settings SET "sportsOffered" = 'Cricket' WHERE id = 'singleton'`
  console.log('✅ Settings updated — sportsOffered = Cricket only')

  // Delete all Football slots
  const deleted = await sql`DELETE FROM slots WHERE sport = 'Football' RETURNING id`
  console.log(`✅ Deleted ${deleted.length} Football slots from database`)

  console.log('\n🎉 Done! Only Cricket remains.')
}

removeFootball().catch(e => { console.error('❌', e.message); process.exit(1) })
