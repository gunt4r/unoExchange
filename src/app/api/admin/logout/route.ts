import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { logout } from '@/services/admin';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    await logout(response);
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to logout' },
      { status: 400 },
    );
  }
}
