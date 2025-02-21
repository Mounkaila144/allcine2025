// components/dashboard/routes.ts
import {
    LayoutDashboard,
    ShoppingBag,
    Calendar,
    Star,
    Menu,
    Package,
    Settings,
    Users, ExternalLink,
} from 'lucide-react';

export interface Route {
    label: string;
    icon: React.ComponentType;
    href: string;
    color?: string; // Optional color for the icon and text
    isExternal?: boolean; // Flag for external links
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
        label: 'Users',
        icon: Users,
        href: '/dashboard/users',
    },
    {
        label: 'Settings',
        icon: Settings,
        href: '/dashboard/settings',
    },
    {
        label: 'Site Client',
        icon: ExternalLink, // Use ExternalLink icon
        href: '/client',
        color: 'text-blue-600', // A slightly darker blue for external links
        isExternal: true, // Mark as external
    },

];