import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromToken, sessionCookie } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await getSessionFromToken(request.cookies.get(sessionCookie)?.value);
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const pathname = request.nextUrl.pathname;
  if ((pathname.startsWith('/admin') || pathname.startsWith('/report')) &&
      session.user.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|$).*)'],
};
