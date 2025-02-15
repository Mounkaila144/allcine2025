"use client";
import { useEffect, useState, Suspense } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/lib/redux/store';
import { ThemeProvider } from "@/components/theme-provider";
import LoadingSpinner from "@/components/LoadingSpinner";
import { usePathname, useSearchParams } from 'next/navigation';

function QueryListener({ onQueryChange }: { onQueryChange: () => void }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        onQueryChange();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]);

    return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [isClient, setIsClient] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleQueryChange = () => {
        setIsPageLoading(true);
        const timeout = setTimeout(() => {
            setIsPageLoading(false);
        }, 500); // Temps minimal d'affichage du spinner
        return () => clearTimeout(timeout);
    };

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
                    <Suspense fallback={<LoadingSpinner />}>
                        <QueryListener onQueryChange={handleQueryChange} />
                        {isPageLoading ? <LoadingSpinner /> : children}
                    </Suspense>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}
