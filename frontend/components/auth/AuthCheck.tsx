// components/auth/AuthCheck.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';

export function AuthCheck() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const auth = useAppSelector((state) => state.auth);

    useEffect(() => {
        const checkAuth = async () => {
            console.log('🔐 Vérification initiale de l\'auth:', auth);

            // Attendre un court instant pour s'assurer que Redux est hydraté
            await new Promise(resolve => setTimeout(resolve, 100));

            if (!auth.isAuthenticated || !auth.token) {
                console.log('⚠️ Non authentifié, redirection vers login');
                router.push('/');
            } else {
                console.log('✅ Authentification validée');
            }

            setIsChecking(false);
        };

        checkAuth();
    }, [auth.isAuthenticated, auth.token, router]);

    if (isChecking) {
        return null;
    }

    return null;
}