import Redis from "ioredis"

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  tls: {
    rejectUnauthorized: false
  },
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 5,
  enableReadyCheck: false,
  enableOfflineQueue: false,
  lazyConnect: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('error', (err) => {
  console.error('Redis error (non-critical):', err ? (err.stack || err) : 'unknown error');
});

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

