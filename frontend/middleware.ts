// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Seule la route dashboard nécessite une authentification
const protectedRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Récupérer les tokens et le rôle depuis les cookies
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value;

    // Fonction pour vérifier si le chemin commence par un préfixe
    const pathStartsWith = (prefix: string) => path === prefix || path.startsWith(`${prefix}/`);


    // Si l'utilisateur tente d'accéder au dashboard
    if (pathStartsWith('/dashboard')) {
        // Vérifier si l'utilisateur est authentifié et est admin
        if (!token || role !== 'admin') {
            return NextResponse.redirect(new URL('/client', request.url));
        }
    }

    // Permettre l'accès à toutes les autres routes
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
