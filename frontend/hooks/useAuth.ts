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
        if (pathname.startsWith('/dashboard') && (!isAuthenticated || user?.role !== 'admin')) {
            toast.error("Accès non autorisé");
            router.replace('/client/login');
        }
    }, [isAuthenticated, user, pathname]);

    return { isAuthenticated, token, user };
}