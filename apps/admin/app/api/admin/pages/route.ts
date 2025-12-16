import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/session';
import prisma from '@/lib/prisma';

// Force dynamic rendering for admin routes (they use cookies/sessions)
export const dynamic = 'force-dynamic';

// GET /api/admin/pages - List all pages
export async function GET() {
  try {
    // Check authentication first
    try {
      await requireAdminSession();
    } catch (authError: any) {
      if (authError.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      throw authError;
    }
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set');
      return NextResponse.json({ 
        error: 'Database configuration error',
        details: 'DATABASE_URL environment variable is missing. Please check your Vercel environment variables.'
      }, { status: 500 });
    }
    
    // Test database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError: any) {
      console.error('Database connection test failed:', dbError);
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: `Cannot connect to database: ${dbError.message || 'Unknown error'}`,
        code: dbError.code
      }, { status: 500 });
    }
    
    const pages = await prisma.page.findMany({
      include: {
        translations: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(pages);
  } catch (error: any) {
    console.error('Error fetching pages:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      name: error.name
    });
    
    // Check for specific Prisma errors
    if (error.code === 'P1001') {
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: 'Veritabanı sunucusuna bağlanılamıyor. DATABASE_URL değişkenini kontrol edin.'
      }, { status: 500 });
    }
    
    if (error.code === 'P1017') {
      return NextResponse.json({ 
        error: 'Database connection closed',
        details: 'Veritabanı bağlantısı kapatıldı. Lütfen tekrar deneyin.'
      }, { status: 500 });
    }
    
    // Return detailed error
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      details: error.message || 'Bilinmeyen bir hata oluştu.',
      code: error.code,
      type: error.name
    }, { status: 500 });
  }
}

// POST /api/admin/pages - Create new page
export async function POST(request: NextRequest) {
  try {
    // Check authentication first
    try {
      await requireAdminSession();
    } catch (authError: any) {
      if (authError.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      throw authError;
    }
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set');
      return NextResponse.json({ 
        error: 'Database configuration error',
        details: 'DATABASE_URL environment variable is missing. Please check your Vercel environment variables.'
      }, { status: 500 });
    }
    
    // Parse request body
    let data;
    try {
      data = await request.json();
    } catch (parseError: any) {
      return NextResponse.json({ 
        error: 'Invalid request body',
        details: parseError.message
      }, { status: 400 });
    }
    
    const { translations, ...pageData } = data;
    
    // Validate required fields
    if (!pageData.slug) {
      return NextResponse.json({ 
        error: 'Validation error',
        details: 'Slug is required'
      }, { status: 400 });
    }
    
    if (!translations || !Array.isArray(translations) || translations.length === 0) {
      return NextResponse.json({ 
        error: 'Validation error',
        details: 'At least one translation is required'
      }, { status: 400 });
    }
    
    // Clean translations - remove any fields that don't exist in PageTranslation schema
    const cleanTranslations = (translations || []).map((trans: any) => ({
      locale: trans.locale,
      title: trans.title || '',
      description: trans.description || null,
      excerpt: trans.excerpt || null,
      content: trans.content || null,
      seoTitle: trans.seoTitle || null,
      seoDesc: trans.seoDesc || null,
      canonical: trans.canonical || null,
      // Explicitly exclude: challenge, insight, idea, execution, impact, behindScenes
    }));

    // Create page with translations
    const page = await prisma.page.create({
      data: {
        ...pageData,
        translations: {
          create: cleanTranslations,
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error: any) {
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Bu URL adresi zaten kullanılıyor',
        details: 'Bu slug zaten başka bir sayfada kullanılıyor. Lütfen farklı bir URL adresi seçin.'
      }, { status: 400 });
    }
    
    if (error.code === 'P1001') {
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: 'Veritabanı sunucusuna bağlanılamıyor. DATABASE_URL değişkenini kontrol edin.'
      }, { status: 500 });
    }
    
    if (error.code === 'P1017') {
      return NextResponse.json({ 
        error: 'Database connection closed',
        details: 'Veritabanı bağlantısı kapatıldı. Lütfen tekrar deneyin.'
      }, { status: 500 });
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        error: 'Record not found',
        details: 'Kayıt bulunamadı.'
      }, { status: 404 });
    }
    
    console.error('Error creating page:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      name: error.name
    });
    
    // Return detailed error (always in production for debugging)
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      details: error.message || 'Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.',
      code: error.code,
      type: error.name
    }, { status: 500 });
  }
}
