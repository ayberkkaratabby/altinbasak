import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Health check endpoint for admin panel
 * Tests database connection and returns status
 */
export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      ADMIN_USERNAME: !!process.env.ADMIN_USERNAME,
      ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    };

    // Test database connection
    let dbConnected = false;
    let dbError = null;
    
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
    } catch (error: any) {
      dbConnected = false;
      dbError = {
        message: error.message,
        code: error.code,
        name: error.name,
      };
    }

    return NextResponse.json({
      status: dbConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        ...envCheck,
      },
      database: {
        connected: dbConnected,
        error: dbError,
      },
    }, { 
      status: dbConnected ? 200 : 503 
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: {
        message: error.message,
        name: error.name,
      },
    }, { status: 500 });
  }
}

