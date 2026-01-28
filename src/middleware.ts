import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that don't require any authentication
const publicRoutes = ['/', '/login', '/signup', '/verify', '/legal/privacy', '/legal/terms'];

// Routes allowed before onboarding completion
const preOnboardingRoutes = ['/onboarding', '/account'];

// Auth routes that should redirect if already logged in
const authRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get the token to check authentication status
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
    });

    const isAuthenticated = !!token;
    const onboardingComplete = token?.onboardingComplete ?? false;

    // Allow public routes
    if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Allow API routes (they handle their own auth)
    if (pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Allow static files
    if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico')) {
        return NextResponse.next();
    }

    // Redirect to login if accessing protected route while not authenticated
    if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If authenticated but onboarding not complete
    if (isAuthenticated && !onboardingComplete) {
        // Allow access to onboarding and account pages
        if (preOnboardingRoutes.some(route => pathname.startsWith(route))) {
            return NextResponse.next();
        }

        // Allow sign out
        if (pathname === '/api/auth/signout') {
            return NextResponse.next();
        }

        // Redirect everything else to onboarding
        const onboardingUrl = new URL('/onboarding', request.url);
        return NextResponse.redirect(onboardingUrl);
    }

    // If logged in and visiting auth pages, redirect to home
    if (isAuthenticated && authRoutes.some(route => pathname === route)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
