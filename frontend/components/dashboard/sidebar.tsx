'use client';

import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLogoutMutation } from '@/lib/redux/api/authApi';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Calendar,
  Star,
  Menu,
  Package,
  LogOut,
  Settings,
  Users
} from 'lucide-react';

const routes = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Contenue',
    icon: Package,
    href: '/dashboard/contents',
  },
  {
    label: 'Categories',
    icon: Menu,
    href: '/dashboard/categories',
  },
  {
    label: 'Articles',
    icon: Menu,
    href: '/dashboard/articles',
  },

  {
    label: 'Orders',
    icon: ShoppingBag,
    href: '/dashboard/orders',
  },
  {
    label: 'Reservations',
    icon: Calendar,
    href: '/dashboard/reservations',
  },
  {
    label: 'Reviews',
    icon: Star,
    href: '/dashboard/reviews',
  },
  {
    label: 'Users',
    icon: Users,
    href: '/dashboard/users',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [logout] = useLogoutMutation(); // Ajout de la mutation logout
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout().unwrap(); // Déclenche l'API de logout
      localStorage.removeItem('token');
      localStorage.removeItem('tenant_id');
      router.push('/'); // Redirige proprement
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="w-64 h-full glass-effect border-r border-blue-900/20">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-400">Admin Dashboard</h1>
        </div>
        
        <div className="flex-1 px-3">
          <div className="space-y-1">
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
                {route.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="p-4 mt-auto border-t border-blue-900/20">
          <Button
              variant="ghost"
              className="w-full justify-start text-blue-100/80 hover:text-white hover:bg-blue-500/10"
              onClick={handleLogout} // Utilisation de la fonction handleLogout
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}