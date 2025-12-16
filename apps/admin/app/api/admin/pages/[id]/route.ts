import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/session';
import prisma from '@/lib/prisma';

// Force dynamic rendering for admin routes (they use cookies/sessions)
export const dynamic = 'force-dynamic';

// GET /api/admin/pages/[id] - Get single page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
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
    
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!page) {
      return NextResponse.json({ 
        error: 'Page not found',
        details: `Page with ID "${id}" not found in database.`
      }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error: any) {
    console.error('Error fetching page:', {
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
    
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      details: error.message || 'Bilinmeyen bir hata oluştu.',
      code: error.code,
      type: error.name
    }, { status: 500 });
  }
}

// PATCH /api/admin/pages/[id] - Update page
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
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
    
    // Update page
    const page = await prisma.page.update({
      where: { id },
      data: pageData,
      include: {
        translations: true,
      },
    });

    // Update or create translations
    if (cleanTranslations && cleanTranslations.length > 0) {
      for (const translation of cleanTranslations) {
        await prisma.pageTranslation.upsert({
          where: {
            pageId_locale: {
              pageId: id,
              locale: translation.locale,
            },
          },
          update: translation,
          create: {
            ...translation,
            pageId: id,
          },
        });
      }
    }

    // Fetch updated page with translations
    const updatedPage = await prisma.page.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        error: 'Page not found',
        details: `Page with ID "${id || params.id}" not found in database.`
      }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Bu URL adresi zaten kullanılıyor',
        details: 'Bu slug zaten başka bir sayfada kullanılıyor. Lütfen farklı bir URL adresi seçin.'
      }, { status: 400 });
    }
    
    // Check for specific Prisma errors
    if (error.code === 'P1001') {
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: 'Veritabanı sunucusuna bağlanılamıyor. DATABASE_URL değişkenini kontrol edin.'
      }, { status: 500 });
    }
    
    console.error('Error updating page:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      details: error.message || 'Bilinmeyen bir hata oluştu.',
      code: error.code,
      type: error.name
    }, { status: 500 });
  }
}

// DELETE /api/admin/pages/[id] - Delete page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
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
    
    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        error: 'Page not found',
        details: `Page with ID "${id || params.id}" not found in database.`
      }, { status: 404 });
    }
    
    // Check for specific Prisma errors
    if (error.code === 'P1001') {
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: 'Veritabanı sunucusuna bağlanılamıyor. DATABASE_URL değişkenini kontrol edin.'
      }, { status: 500 });
    }
    
    console.error('Error deleting page:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      name: error.name,
      pageId: id || params.id
    });
    
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      details: error.message || 'Bilinmeyen bir hata oluştu.',
      code: error.code,
      type: error.name
    }, { status: 500 });
  }
}
