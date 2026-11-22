/** Simple in‑memory rate limiter per email */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  /**
   * Record a request and return true if the limit is exceeded.
   * @param key unique identifier (email)
   * @param limit max number of requests
   * @param windowMs time window in ms
   */
  isLimited(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const timestamps = this.attempts.get(key) ?? [];
    // keep only timestamps within the window
    const recent = timestamps.filter((t) => now - t < windowMs);
    recent.push(now);
    this.attempts.set(key, recent);
    return recent.length > limit;
  }
}

export const rateLimiter = new RateLimiter();
