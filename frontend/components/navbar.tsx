// components/Navbar.tsx
"use client";
import Link from "next/link";
import {
    Film,
    Newspaper,
    List,
    Tag as PriceTag,
    ThumbsUp,
    BookOpen,
    Gift,
    LogIn,
    LogOut,
    Menu,
    X,
    ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import Image from "next/image";
import { selectCartItems, setCartOpen } from "@/lib/redux/slices/cartSlice";
import { CartDrawer } from "@/components/CartDrawer";
import { Badge } from "@/components/ui/badge";
import {toast} from "sonner";

const navigation = [
    { name: 'Accueil', href: '/client/', icon: Film },
    { name: 'Film/Serie/Manga', href: '/client/contentClient', icon: List },
    { name: 'Tarifs', href: '/client/tarifs', icon: PriceTag },
    { name: 'Recommandations', href: '/client/recommandations', icon: ThumbsUp },
    { name: 'Produits', href: '/client/articles', icon: BookOpen },
    { name: 'Carte Fidélité', href: '/client/fidelite', icon: Gift },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const cartItems = useAppSelector(selectCartItems);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Déconnexion réussie");
    };

    const cartItemCount = cartItems.reduce((total, item) => total + item.quantite, 0);

    const renderAuthButton = () => {
        if (isAuthenticated) {
            return (
                <div className="flex items-center gap-2">
                     {user?.role === "admin" && (
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-yellow-600/10 text-yellow-500 hover:bg-yellow-600 hover:text-white transition-colors"
                        >
                            <List className="h-5 w-5" />
                            Admin
                        </Link>
                    )}
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleLogout}
                        className="flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                    </Button>
                </div>
            );
        }

        return (
            <Link
                href="/client/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-yellow-600 text-white hover:bg-yellow-600/90 transition-colors"
            >
                <LogIn className="h-5 w-5" />
                Connexion
            </Link>
        );
    };

    return (
        <nav className="bg-background border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/client" className="flex items-center">
                            <Image
                                src="/image/logo.png"
                                alt="Logo"
                                width={80}
                                height={40}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-muted-foreground hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                {item.name}
                            </Link>
                        ))}
                        {renderAuthButton()}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => dispatch(setCartOpen(true))}
                            className="relative"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cartItemCount > 0 && (
                                <Badge className="absolute -top-2 -right-2 bg-yellow-500">
                                    {cartItemCount}
                                </Badge>
                            )}
                        </Button>
                        <ModeToggle />
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => dispatch(setCartOpen(true))}
                            className="relative mr-2"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cartItemCount > 0 && (
                                <Badge className="absolute -top-2 -right-2 bg-yellow-500">
                                    {cartItemCount}
                                </Badge>
                            )}
                        </Button>
                        <ModeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                            className="ml-2"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center text-muted-foreground hover:text-yellow-500 px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                        <div className="px-3 py-2">
                            {renderAuthButton()}
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Drawer */}
            <CartDrawer />
        </nav>
    );
}