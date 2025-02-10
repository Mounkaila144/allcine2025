"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push("/client/login"); // Rediriger automatiquement vers /client/login
    }, [router]);

    return null; // Éviter tout affichage sur cette page
}
