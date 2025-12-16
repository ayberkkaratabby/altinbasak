import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/session';
import prisma from '@/lib/prisma';

const THEME_KEY = 'theme_colors';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || !session.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get theme from database
    const setting = await prisma.setting.findUnique({
      where: { key: THEME_KEY },
    });

    if (!setting) {
      // Return default colors
      return NextResponse.json({
        colors: {
          primary: '#000000',
          secondary: '#1a1a1a',
          accent: '#D4AF37',
          background: '#ffffff',
          text: '#000000',
          textMuted: '#666666',
        },
      });
    }

    const colors = JSON.parse(setting.value);
    return NextResponse.json({ colors });
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session || !session.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { colors } = await request.json();

    // Validate colors
    const requiredKeys = ['primary', 'secondary', 'accent', 'background', 'text', 'textMuted'];
    for (const key of requiredKeys) {
      if (!colors[key] || !/^#[0-9A-Fa-f]{6}$/.test(colors[key])) {
        return NextResponse.json(
          { error: `Invalid color format for ${key}` },
          { status: 400 }
        );
      }
    }

    // Save to database
    await prisma.setting.upsert({
      where: { key: THEME_KEY },
      update: {
        value: JSON.stringify(colors),
      },
      create: {
        key: THEME_KEY,
        value: JSON.stringify(colors),
      },
    });

    return NextResponse.json({ success: true, colors });
  } catch (error) {
    console.error('Error saving theme:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

