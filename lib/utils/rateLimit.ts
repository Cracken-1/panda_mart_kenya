/**
 * A simple in-memory rate limiter for API routes
 */

interface RateLimiterOptions {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval?: number // Max number of unique tokens per interval
}

export default function rateLimit(options: RateLimiterOptions) {
  const tokenCache = new Map()
  const { interval, uniqueTokenPerInterval = 500 } = options
  
  return {
    /**
     * Check if the token has exceeded the rate limit
     * @param limit Maximum number of requests allowed in the time window
     * @param token Unique identifier for the client (e.g., IP address)
     */
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || []
        const currentTime = Date.now()
        
        // Remove timestamps that are outside the interval window
        const validTimestamps = tokenCount.filter((timestamp: number) => 
          currentTime - timestamp < interval
        )
        
        // Check if the number of calls in the current interval exceeds the limit
        if (validTimestamps.length >= limit) {
          const oldestTimestamp = Math.min(...validTimestamps)
          const timeUntilReset = oldestTimestamp + interval - currentTime
          reject({
            status: 429,
            message: 'Too many requests',
            timeUntilReset: Math.ceil(timeUntilReset / 1000) // in seconds
          })
          return
        }
        
        // Add the current timestamp
        validTimestamps.push(currentTime)
        
        // Ensure the cache doesn't grow too large
        if (tokenCache.size > uniqueTokenPerInterval) {
          // Remove the oldest token if we've exceeded the cache size
          const oldestToken = [...tokenCache.keys()][0]
          tokenCache.delete(oldestToken)
        }
        
        // Update the token in the cache
        tokenCache.set(token, validTimestamps)
        
        resolve()
      }),
  }
}