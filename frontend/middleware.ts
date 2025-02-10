// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Seule la route dashboard nécessite une authentification
const protectedRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value;

    // Pour la page de login
    if (path === '/client/login') {
        if (token) {
            return NextResponse.redirect(new URL(
                role === 'admin' ? '/dashboard' : '/client',
                request.url
            ));
        }
        return NextResponse.next();
    }

    // Pour le dashboard
    if (path.startsWith('/dashboard')) {
        if (!token || role !== 'admin') {
            return NextResponse.redirect(new URL('/client/login', request.url));
        }
    }

    return NextResponse.next();
}
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * 1. /api/ (API routes)
         * 2. /_next/ (Next.js internals)
         * 3. /fonts/ (inside public directory)
         * 4. /images/ (inside public directory)
         * 5. all files in the public directory
         */
        '/((?!api|_next|fonts|images|[\\w-]+\\.\\w+).*)',
    ],
}
