// hooks/useAuth.ts
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';

export function useAuth(requireAuth: boolean = true) {
    const router = useRouter();
    const auth = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (requireAuth && (!auth.isAuthenticated || !auth.token)) {
            console.log('🔒 Redirection vers login (non authentifié)');
            router.push('/');
        } else if (!requireAuth && auth.isAuthenticated && auth.token) {
            console.log('🔓 Redirection vers dashboard (déjà authentifié)');
            router.push('/client');
        }
    }, [auth.isAuthenticated, auth.token, requireAuth, router]);

    return auth;
}