'use client';
import { useAppSelector } from '@/lib/redux/hooks';
import { useEffect } from 'react';

export function DebugAuth() {
    const auth = useAppSelector((state) => state.auth);

    useEffect(() => {
        console.log("🛠️ État Redux Persist après refresh :", auth);
    }, [auth]);

    return null;
}
