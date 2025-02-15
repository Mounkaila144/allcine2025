// app/providers.tsx
"use client";
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/lib/redux/store';
import { ThemeProvider } from "@/components/theme-provider";
import LoadingSpinner from "@/components/LoadingSpinner";
import { usePathname, useSearchParams } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
    const [isClient, setIsClient] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        setIsPageLoading(true);
        const timeout = setTimeout(() => {
            setIsPageLoading(false);
        }, 500); // Minimum display time for the spinner

        return () => clearTimeout(timeout);
    }, [pathname, searchParams]);

    if (!isClient) {
        return <LoadingSpinner />;
    }

    return (
        <Provider store={store}>
            <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    storageKey="theme"
                    disableTransitionOnChange
                >
                    {isPageLoading ? <LoadingSpinner /> : children}
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}