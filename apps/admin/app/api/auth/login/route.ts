import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import { createAdminSession } from '@/lib/session';
import { checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Check rate limiting first
    const rateLimit = checkRateLimit(request);
    
    if (!rateLimit.allowed) {
      const message = rateLimit.lockedUntil
        ? `Too many failed attempts. Please try again after ${new Date(rateLimit.lockedUntil).toLocaleTimeString()}.`
        : 'Too many login attempts. Please try again later.';
      
      return NextResponse.json(
        { 
          error: message,
          lockedUntil: rateLimit.lockedUntil,
        },
        { status: 429 }
      );
    }
    
    const { username, password } = await request.json();
    
    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    const isValid = await authenticate(username, password);
    
    if (!isValid) {
      // Record failed attempt
      recordFailedAttempt(request);
      
      // Return generic error (don't reveal which field was wrong)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Clear any previous failed attempts on success
    clearAttempts(request);
    
    // Create session
    await createAdminSession(username);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    // If it's a config validation error, return 500 with clear message
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('ADMIN_USERNAME') || errorMessage.includes('ADMIN_PASSWORD')) {
      console.error('Auth configuration error:', errorMessage);
      return NextResponse.json(
        { error: 'Server configuration error. Please contact administrator.' },
        { status: 500 }
      );
    }
    
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
