// components/dashboard/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { routes } from './routes';
import { logout } from "@/lib/redux/slices/authSlice";
import {toast} from "sonner";
import {useAppDispatch} from "@/lib/redux/hooks";


export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Déconnexion réussie");
    router.push('/');

  };

  return (
      <aside className="fixed top-0 left-0 w-64 h-screen border-r border-blue-900/20 z-30"
             style={{
               backgroundColor: 'rgba(17, 25, 40, 0.75)',
               backdropFilter: 'blur(10px)',
               WebkitBackdropFilter: 'blur(10px)',
             }}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <Link href="/dashboard">
              <h1 className="text-xl font-bold text-blue-400">Admin Dashboard</h1>
            </Link>
          </div>

          <div className="flex-1 px-3 overflow-y-auto">
            <nav className="space-y-1">
              {routes.map((route) => (
                  <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                          'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          pathname === route.href
                              ? 'bg-blue-600 text-white'
                              : 'text-blue-100/80 hover:text-white hover:bg-blue-500/10'
                      )}
                  >
                    <route.icon className="h-5 w-5 mr-3" />
                    <span className="whitespace-nowrap">{route.label}</span>
                  </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-blue-900/20 mt-auto">
            <Button
                variant="ghost"
                className="w-full justify-start text-blue-100/80 hover:text-white hover:bg-blue-500/10"
                onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
  );
}