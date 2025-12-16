import 'server-only';

/**
 * Simple in-memory rate limiter for admin login attempts
 * 
 * In production, consider using Redis or a dedicated rate limiting service.
 * This implementation uses in-memory storage and will reset on server restart.
 */

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lockedUntil?: number;
}

const attempts = new Map<string, AttemptRecord>();

// Configuration
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 30 * 60 * 1000; // 30 minutes lockout after max attempts

/**
 * Get client identifier (IP address)
 */
function getClientId(request: Request): string {
  // Try to get real IP from headers (useful behind proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback (won't work in serverless, but useful for local dev)
  return 'unknown';
}

/**
 * Check if IP is rate limited
 * Returns { allowed: boolean, remainingAttempts: number, lockedUntil?: number }
 */
export function checkRateLimit(request: Request): {
  allowed: boolean;
  remainingAttempts: number;
  lockedUntil?: number;
} {
  const clientId = getClientId(request);
  const now = Date.now();
  
  let record = attempts.get(clientId);
  
  // Clean up old records
  if (record && record.firstAttempt < now - WINDOW_MS && !record.lockedUntil) {
    attempts.delete(clientId);
    record = undefined;
  }
  
  // Check if locked out
  if (record?.lockedUntil) {
    if (record.lockedUntil > now) {
      return {
        allowed: false,
        remainingAttempts: 0,
        lockedUntil: record.lockedUntil,
      };
    } else {
      // Lockout expired, reset
      attempts.delete(clientId);
      record = undefined;
    }
  }
  
  // Create new record if needed
  if (!record) {
    record = {
      count: 0,
      firstAttempt: now,
    };
    attempts.set(clientId, record);
  }
  
  // Check if within window
  if (now - record.firstAttempt > WINDOW_MS) {
    // Window expired, reset
    record = {
      count: 0,
      firstAttempt: now,
    };
    attempts.set(clientId, record);
  }
  
  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - record.count);
  
  if (record.count >= MAX_ATTEMPTS) {
    // Lock out
    record.lockedUntil = now + LOCKOUT_MS;
    attempts.set(clientId, record);
    
    return {
      allowed: false,
      remainingAttempts: 0,
      lockedUntil: record.lockedUntil,
    };
  }
  
  return {
    allowed: true,
    remainingAttempts,
  };
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(request: Request): void {
  const clientId = getClientId(request);
  const now = Date.now();
  
  let record = attempts.get(clientId);
  
  if (!record) {
    record = {
      count: 0,
      firstAttempt: now,
    };
  }
  
  // Reset if window expired
  if (now - record.firstAttempt > WINDOW_MS) {
    record = {
      count: 0,
      firstAttempt: now,
    };
  }
  
  record.count++;
  
  // Lock out if max attempts reached
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
  }
  
  attempts.set(clientId, record);
}

/**
 * Clear attempts for a client (on successful login)
 */
export function clearAttempts(request: Request): void {
  const clientId = getClientId(request);
  attempts.delete(clientId);
}

