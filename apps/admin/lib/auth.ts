/**
 * Simple Internal Authentication
 * 
 * This is a basic username/password authentication system for internal use.
 * Credentials are read from environment variables.
 * 
 * For production, consider implementing a proper user management system with database.
 */

/**
 * Validate that required environment variables are set
 * Throws error if missing (should be called at app startup)
 */
export function validateAuthConfig(): void {
  if (!process.env.ADMIN_USERNAME) {
    throw new Error(
      'ADMIN_USERNAME environment variable is required. ' +
      'Please set it in your .env.local file or environment.'
    );
  }
  
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error(
      'ADMIN_PASSWORD environment variable is required. ' +
      'Please set it in your .env.local file or environment.'
    );
  }
  
  // Warn if password is too weak
  const password = process.env.ADMIN_PASSWORD;
  if (password.length < 12) {
    console.warn(
      '⚠️  WARNING: ADMIN_PASSWORD is less than 12 characters. ' +
      'Consider using a stronger password for production.'
    );
  }
}

/**
 * Authenticate a user by username and password
 * Returns true if credentials match, false otherwise
 * 
 * REQUIRES: ADMIN_USERNAME and ADMIN_PASSWORD environment variables
 */
export async function authenticate(username: string, password: string): Promise<boolean> {
  // Ensure config is validated (will throw if missing)
  validateAuthConfig();
  
  const adminUsername = process.env.ADMIN_USERNAME!;
  const adminPassword = process.env.ADMIN_PASSWORD!;
  
  // Server-side validation only - never expose credentials in client bundles
  // Use constant-time comparison to prevent timing attacks
  return constantTimeEquals(username, adminUsername) && 
         constantTimeEquals(password, adminPassword);
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Admin session interface
 */
export interface AdminSession {
  username: string;
  authenticated: boolean;
}

