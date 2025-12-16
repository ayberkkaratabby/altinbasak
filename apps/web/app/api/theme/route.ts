import { NextResponse } from 'next/server';

// This endpoint would fetch from the admin app's database in production
// For now, we'll return default colors
// In a real setup, you'd share the database or use an API call between apps

export async function GET() {
  try {
    // In production, fetch from shared database or admin API
    // For now, return defaults
    const defaultColors = {
      primary: '#000000',
      secondary: '#1a1a1a',
      accent: '#D4AF37',
      background: '#ffffff',
      text: '#000000',
      textMuted: '#666666',
    };

    return NextResponse.json({ colors: defaultColors });
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

