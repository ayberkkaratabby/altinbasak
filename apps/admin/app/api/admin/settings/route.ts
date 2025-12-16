import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/session';
import prisma from '@/lib/prisma';

const SETTINGS_KEYS = {
  SITE: 'site_settings',
  ANALYTICS: 'analytics_settings',
} as const;

// GET /api/admin/settings - Get all settings
export async function GET() {
  try {
    await requireAdminSession();
    
    const [siteSettings, analyticsSettings] = await Promise.all([
      prisma.setting.findUnique({ where: { key: SETTINGS_KEYS.SITE } }),
      prisma.setting.findUnique({ where: { key: SETTINGS_KEYS.ANALYTICS } }),
    ]);

    return NextResponse.json({
      site: siteSettings ? JSON.parse(siteSettings.value) : {
        siteName: 'Altınbaşak Pastanesi',
        siteDescription: 'Tekirdağ merkezli lüks patisserie',
        siteUrl: 'https://altinbasak.com',
        contactEmail: 'info@altinbasak.com',
        contactPhone: '+90 282 123 45 67',
        address: 'Tekirdağ Merkez',
      },
      analytics: analyticsSettings ? JSON.parse(analyticsSettings.value) : {
        ga4Id: '',
        metaPixelId: '',
        additionalScripts: '',
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    await requireAdminSession();
    
    const data = await request.json();
    const { site, analytics } = data;

    // Update site settings
    if (site) {
      await prisma.setting.upsert({
        where: { key: SETTINGS_KEYS.SITE },
        update: { value: JSON.stringify(site) },
        create: { key: SETTINGS_KEYS.SITE, value: JSON.stringify(site) },
      });
    }

    // Update analytics settings
    if (analytics) {
      await prisma.setting.upsert({
        where: { key: SETTINGS_KEYS.ANALYTICS },
        update: { value: JSON.stringify(analytics) },
        create: { key: SETTINGS_KEYS.ANALYTICS, value: JSON.stringify(analytics) },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

