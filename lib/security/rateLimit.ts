// In-memory rate limiting (for development)
// In production, use Redis or similar distributed cache

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

interface RateLimitOptions {
  key: string
  limit: number
  window: number // in milliseconds
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  totalHits: number
}

export async function rateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const { key, limit, window } = options
  const now = Date.now()
  
  // Clean up expired entries
  cleanupExpiredEntries(now)
  
  // Get or create entry
  let entry = store[key]
  
  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetTime: now + window
    }
    store[key] = entry
  }
  
  // Increment counter
  entry.count++
  
  const success = entry.count <= limit
  const remaining = Math.max(0, limit - entry.count)
  
  return {
    success,
    remaining,
    resetTime: entry.resetTime,
    totalHits: entry.count
  }
}

function cleanupExpiredEntries(now: number) {
  // Clean up expired entries to prevent memory leaks
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}

// Advanced rate limiting with different strategies
export class AdvancedRateLimit {
  private store: RateLimitStore = {}

  // Sliding window rate limiting
  async slidingWindow(options: RateLimitOptions): Promise<RateLimitResult> {
    const { key, limit, window } = options
    const now = Date.now()
    const windowStart = now - window
    
    // In a real implementation, this would use a more sophisticated data structure
    // For now, we'll use the simple fixed window approach
    return rateLimit(options)
  }

  // Token bucket rate limiting
  async tokenBucket(options: RateLimitOptions & { refillRate: number }): Promise<RateLimitResult> {
    const { key, limit, window, refillRate } = options
    const now = Date.now()
    
    let entry = this.store[key]
    
    if (!entry) {
      entry = {
        count: limit, // Start with full bucket
        resetTime: now
      }
      this.store[key] = entry
    }
    
    // Calculate tokens to add based on time passed
    const timePassed = now - entry.resetTime
    const tokensToAdd = Math.floor((timePassed / 1000) * refillRate)
    
    if (tokensToAdd > 0) {
      entry.count = Math.min(limit, entry.count + tokensToAdd)
      entry.resetTime = now
    }
    
    const success = entry.count > 0
    
    if (success) {
      entry.count--
    }
    
    return {
      success,
      remaining: entry.count,
      resetTime: entry.resetTime + ((limit - entry.count) / refillRate) * 1000,
      totalHits: limit - entry.count
    }
  }

  // Leaky bucket rate limiting
  async leakyBucket(options: RateLimitOptions & { leakRate: number }): Promise<RateLimitResult> {
    const { key, limit, leakRate } = options
    const now = Date.now()
    
    let entry = this.store[key]
    
    if (!entry) {
      entry = {
        count: 0,
        resetTime: now
      }
      this.store[key] = entry
    }
    
    // Calculate requests that have leaked out
    const timePassed = now - entry.resetTime
    const requestsLeaked = Math.floor((timePassed / 1000) * leakRate)
    
    if (requestsLeaked > 0) {
      entry.count = Math.max(0, entry.count - requestsLeaked)
      entry.resetTime = now
    }
    
    const success = entry.count < limit
    
    if (success) {
      entry.count++
    }
    
    return {
      success,
      remaining: Math.max(0, limit - entry.count),
      resetTime: entry.resetTime + ((entry.count / leakRate) * 1000),
      totalHits: entry.count
    }
  }
}

// Rate limiting by user ID
export async function rateLimitByUser(
  userId: string, 
  action: string, 
  limit: number, 
  window: number
): Promise<RateLimitResult> {
  const key = `user:${userId}:${action}`
  return rateLimit({ key, limit, window })
}

// Rate limiting by IP address
export async function rateLimitByIP(
  ip: string, 
  action: string, 
  limit: number, 
  window: number
): Promise<RateLimitResult> {
  const key = `ip:${ip}:${action}`
  return rateLimit({ key, limit, window })
}

// Distributed rate limiting (for production with Redis)
export class RedisRateLimit {
  private redis: any // Redis client

  constructor(redisClient: any) {
    this.redis = redisClient
  }

  async rateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
    const { key, limit, window } = options
    const now = Date.now()
    const windowStart = now - window

    // Use Redis sorted sets for sliding window
    const pipeline = this.redis.pipeline()
    
    // Remove expired entries
    pipeline.zremrangebyscore(key, 0, windowStart)
    
    // Count current requests
    pipeline.zcard(key)
    
    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`)
    
    // Set expiration
    pipeline.expire(key, Math.ceil(window / 1000))
    
    const results = await pipeline.exec()
    const currentCount = results[1][1]
    
    const success = currentCount <= limit
    const remaining = Math.max(0, limit - currentCount)
    
    return {
      success,
      remaining,
      resetTime: now + window,
      totalHits: currentCount
    }
  }
}

export default rateLimit