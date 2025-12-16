import 'server-only';
import { cookies } from 'next/headers';

/**
 * Simple Admin Session Management
 * 
 * Uses a secure cookie to store admin authentication state.
 * Session expires after 7 days of inactivity.
 */

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface AdminSession {
  username: string;
  authenticated: boolean;
  expiresAt: number;
}

/**
 * Create an admin session
 */
export async function createAdminSession(username: string): Promise<void> {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + SESSION_DURATION;
  
  const session: AdminSession = {
    username,
    authenticated: true,
    expiresAt,
  };

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: '/',
  });
}

/**
 * Get current admin session
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie) {
      return null;
    }

    const session: AdminSession = JSON.parse(sessionCookie.value);

    // Check if session expired
    if (session.expiresAt < Date.now()) {
      await deleteAdminSession();
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
}

/**
 * Delete admin session (logout)
 */
export async function deleteAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Require admin authentication
 * Throws error if not authenticated (should be caught by middleware/layout)
 */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  
  if (!session || !session.authenticated) {
    throw new Error('Unauthorized');
  }

  return session;
}

