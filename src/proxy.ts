/* eslint-disable regexp/no-unused-capturing-group */
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './libs/I18nRouting';

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(
  request: NextRequest,
) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const adminPathRegex = /^\/([\w-]+\/)?admin(\/|$)/;
  const isAdminLoginPage = pathname.includes('/admin/login');

  if (adminPathRegex.test(pathname) && !isAdminLoginPage) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      const loginUrl = new URL(`/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
    const { isAdminToken } = await import('@/services/admin');

    if (!isAdminToken(token)) {
      const loginUrl = new URL(`/`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next`, `_vercel` or `monitoring`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|api|.*\\..*).*)',
};
