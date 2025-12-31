import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { authentication } from '@/services/admin';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  try {
    const { token } = await authentication({ username, password });

    const response = NextResponse.redirect(
      new URL('/admin/currencies', request.url),
    );

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to login' },
      { status: 400 },
    );
  }
}
