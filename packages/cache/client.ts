import { Redis } from '@upstash/redis'

type RedisLike = Pick<Redis, 'get' | 'set' | 'del'>

const globalForRedis = globalThis as unknown as {
  redis: RedisLike | undefined
}

const noopRedis: RedisLike = {
  get: async () => null,
  set: async () => null,
  del: async () => 0,
}

const hasRedisConfig = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
)

export const redis =
  globalForRedis.redis ??
  (hasRedisConfig
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      })
    : noopRedis)

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis

export default redis
