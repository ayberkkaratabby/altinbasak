/**
 * Simple Internal Authentication
 * 
 * This is a basic username/password authentication system for internal use.
 * Credentials are read from environment variables.
 * 
 * For production, consider implementing a proper user management system with database.
 */

/**
 * Authenticate a user by username and password
 * Returns true if credentials match, false otherwise
 */
export async function authenticate(username: string, password: string): Promise<boolean> {
  // Read credentials from environment variables
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  // Server-side validation only - never expose credentials in client bundles
  return username === adminUsername && password === adminPassword;
}

/**
 * Admin session interface
 */
export interface AdminSession {
  username: string;
  authenticated: boolean;
}

