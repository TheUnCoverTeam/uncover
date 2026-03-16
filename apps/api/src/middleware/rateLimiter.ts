/**
 * Per-API-key rate limiter using a sliding window in memory.
 * Default: 60 requests per minute per key.
 * Search endpoint: 10 requests per minute per key (more expensive operations).
 */

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();
const WINDOW_MS = 60 * 1000; // 1 minute

export function getRateLimit(endpoint: "default" | "search"): number {
  return endpoint === "search" ? 10 : 60;
}

export function checkRateLimit(
  apiKeyId: string,
  endpoint: "default" | "search" = "default"
): { allowed: boolean; remaining: number; resetAt: number } {
  const limit = getRateLimit(endpoint);
  const key = `${apiKeyId}:${endpoint}`;
  const now = Date.now();

  const existing = windows.get(key);

  // Reset if window has expired
  if (!existing || now >= existing.resetAt) {
    const resetAt = now + WINDOW_MS;
    windows.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  // Increment count
  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  const allowed = existing.count <= limit;

  return { allowed, remaining, resetAt: existing.resetAt };
}

// Cleanup old windows every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, window] of windows.entries()) {
    if (now >= window.resetAt) windows.delete(key);
  }
}, 5 * 60 * 1000);
