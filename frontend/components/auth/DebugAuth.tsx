// components/auth/DebugAuth.tsx
"use client";
import { useAppSelector } from "@/lib/redux/hooks";

export function DebugAuth() {
    const auth = useAppSelector((state) => state.auth);

    if (process.env.NODE_ENV === 'development') {
        return (
            <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-xs max-w-xs">
                <h3 className="font-bold mb-2">Auth Debug:</h3>
                <pre className="whitespace-pre-wrap">
          {JSON.stringify(
              {
                  isAuthenticated: auth.isAuthenticated,
                  token: auth.token ? 'exists' : 'none',
                  user: auth.user,
              },
              null,
              2
          )}
        </pre>
            </div>
        );
    }
    return null;
}