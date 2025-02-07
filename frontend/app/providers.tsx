// app/providers.tsx
"use client";
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/lib/redux/store';
//import { Spinner } from '@/components/ui/spinner'; // Créez ce composant si nécessaire

function LoadingSpinner() {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <h1>loading</h1>
        </div>
    );
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <LoadingSpinner />;
    }

    return (
        <Provider store={store}>
            <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}