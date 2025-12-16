import { NextResponse } from 'next/server';
import { deleteAdminSession } from '@/lib/session';

export async function POST() {
  try {
    await deleteAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

