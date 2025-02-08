// components/dashboard/routes.ts
import {
    LayoutDashboard,
    ShoppingBag,
    Calendar,
    Star,
    Menu,
    Package,
    Settings,
    Users,
} from 'lucide-react';

export interface Route {
    label: string;
    icon: React.ComponentType;
    href: string;
}

export const routes: Route[] = [
    {
        label: 'Tableau de bord',
        icon: LayoutDashboard,
        href: '/dashboard',
    },
    {
        label: 'Film/Serie/Manga',
        icon: Package,
        href: '/dashboard/contents',
    },
    {
        label: 'Categories',
        icon: Calendar,
        href: '/dashboard/categories',
    },
    {
        label: 'Articles',
        icon: Menu,
        href: '/dashboard/articles',
    },
    {
        label: 'Commandes',
        icon: ShoppingBag,
        href: '/dashboard/orders',
    },
    {
        label: 'Fideliter',
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
    },
];