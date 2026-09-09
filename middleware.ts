import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect all /admin routes except /admin/login
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const session = request.cookies.get('admin_session')?.value;
    
    // If no valid session cookie, redirect to login
    if (session !== 'authorized_rc3id') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If session is valid, or it's not an admin route, continue
  return NextResponse.next();
}

// Only run middleware on /admin routes
export const config = {
  matcher: ['/admin/:path*'],
};
