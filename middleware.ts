import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('danny_auth');
    const isAuthenticated = authCookie?.value === 'true';

    const { pathname } = request.nextUrl;

    // Protect only the /settings route
    if (pathname === '/settings' && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Optional UX: redirect logged-in users away from login
    if (pathname === '/login' && isAuthenticated) {
        return NextResponse.redirect(new URL('/settings', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/settings', '/login'],
};
