import Redis from "ioredis"
import dotenv from 'dotenv'
dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  tls: {
    rejectUnauthorized: false
  },
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true
});

