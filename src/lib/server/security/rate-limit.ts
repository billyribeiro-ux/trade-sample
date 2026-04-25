import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';

import { RateLimitError } from '$lib/server/errors';

type LimitName = 'sign-in' | 'sign-up' | 'password-reset' | 'download' | 'magic-link';

const limiters = new Map<LimitName, Ratelimit>();

function getRedis(): Redis | null {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  return new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });
}

function getLimiter(name: LimitName): Ratelimit | null {
  const redis = getRedis();

  if (!redis) {
    return null;
  }

  const cached = limiters.get(name);

  if (cached) {
    return cached;
  }

  const limiter =
    name === 'download'
      ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 m') })
      : name === 'sign-in'
        ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '15 m') })
        : new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1 h') });

  limiters.set(name, limiter);
  return limiter;
}

export async function enforceRateLimit(name: LimitName, key: string): Promise<void> {
  const limiter = getLimiter(name);

  if (!limiter) {
    return;
  }

  const result = await limiter.limit(`${name}:${key}`);

  if (!result.success) {
    throw new RateLimitError();
  }
}
