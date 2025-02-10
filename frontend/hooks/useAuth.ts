
// hooks/useAuth.ts
"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { toast } from "sonner";

export function useAuth() {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, token, user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        // Debug logs
        console.log("Auth State:", {
            isAuthenticated,
            hasToken: !!token,
            userRole: user?.role,
            currentPath: pathname
        });

        // Si l'utilisateur est connecté et sur la route racine
        if (isAuthenticated && token && pathname === '/') {
            router.push('/client');
            return;
        }

        // Protection uniquement de la route dashboard
        if (pathname.startsWith('/dashboard')) {
            if (!isAuthenticated || !token) {
                console.log("User not authenticated, redirecting to client page...");
                router.push('/client');
                toast.error("Veuillez vous connecter pour accéder au tableau de bord");
                return;
            }

            if (user?.role !== 'admin') {
                console.log("Non-admin trying to access dashboard, redirecting...");
                router.push('/client');
                toast.error("Accès non autorisé");
                return;
            }
        }

    }, [isAuthenticated, token, user, router, pathname]);

    return { isAuthenticated, token, user };
}