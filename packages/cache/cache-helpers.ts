import { redis } from './client'

/**
 * Standard read pattern — check cache first, then fetch from DB.
 * Usage:
 *   const data = await withCache(CacheKeys.skills('abarna'), TTL.SKILLS_LIST, () => db.skill.findMany())
 */
export async function withCache<T>(
  key: string,
  ttl: number | null,
  fetcher: () => Promise<T>
): Promise<T> {
  if (ttl === null) return fetcher()

  try {
    const cached = await redis.get<T>(key)
    if (cached !== null && cached !== undefined) return cached
  } catch {
    // Redis unavailable — fall through to DB
  }

  const data = await fetcher()

  try {
    await redis.set(key, data, { ex: ttl })
  } catch {
    // Redis write failed — not fatal, return fresh data
  }

  return data
}

/**
 * Invalidate multiple cache keys atomically.
 * Call this after EVERY mutation. DB-first, then invalidate.
 * Usage:
 *   await cacheInvalidate(CacheKeys.groups.allPortfolio('abarna'))
 */
export async function cacheInvalidate(keys: string[]): Promise<void> {
  if (keys.length === 0) return
  try {
    await redis.del(...keys)
  } catch {
    // Redis unavailable — non-fatal; cache will expire naturally
  }
}
