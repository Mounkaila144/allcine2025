// components/dashboard/mobile-navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {LogOut, Menu, X} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLogoutMutation } from '@/lib/redux/api/authApi';
import { routes } from './routes';
import {logout} from "@/lib/redux/slices/authSlice";
import {toast} from "sonner";
import {useAppDispatch} from "@/lib/redux/hooks"; // On déplacera les routes dans un fichier séparé

export function MobileNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const dispatch = useAppDispatch();


    const handleLogout = () => {
        dispatch(logout());
        toast.success("Déconnexion réussie");
    };

    return (
        <>
            {/* Barre de navigation fixe */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-blue-900/20"
                 style={{
                     backgroundColor: 'rgba(17, 25, 40, 0.95)',
                     backdropFilter: 'blur(10px)',
                     WebkitBackdropFilter: 'blur(10px)',
                 }}>
                <div className="flex items-center justify-between p-4">
                    <Link href="/dashboard">
                        <h1 className="text-xl font-bold text-blue-400">Admin</h1>
                    </Link>
                    <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </nav>

            {/* Menu déroulant */}
            {isOpen && (
                <div className="fixed inset-0 z-40 pt-16"
                     style={{
                         backgroundColor: 'rgba(17, 25, 40, 0.95)',
                         backdropFilter: 'blur(10px)',
                         WebkitBackdropFilter: 'blur(10px)',
                     }}>
                    <div className="flex flex-col h-full overflow-y-auto p-4">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    'flex items-center px-3 py-4 rounded-lg text-sm font-medium transition-colors',
                                    pathname === route.href
                                        ? 'bg-blue-600 text-white'
                                        : 'text-blue-100/80 hover:text-white hover:bg-blue-500/10'
                                )}
                            >
                                <route.icon className="h-5 w-5 mr-3" />
                                {route.label}
                            </Link>
                        ))}

                        <Button
                            className="w-full justify-start bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-5 w-5 mr-3" />
                            Déconnexion
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}