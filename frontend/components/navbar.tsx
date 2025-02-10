"use client";
import Link from "next/link";
import { Film, Newspaper, List, Tag as PriceTag, ThumbsUp, BookOpen, Gift, LogIn, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import { useRouter } from "next/navigation"; //  Correct, but not strictly necessary in this component
import { toast } from "sonner";

const navigation = [
    { name: 'Accueil', href: '/client/', icon: Film },
    { name: 'Actualités', href: '/client/actualites', icon: Newspaper },
    { name: 'Film/Serie/Manga', href: '/client/contentClient', icon: List },
    { name: 'Tarifs', href: '/client/tarifs', icon: PriceTag },
    { name: 'Recommandations', href: '/client/recommandations', icon: ThumbsUp },
    { name: 'Produits', href: '/client/articles', icon: BookOpen },
    { name: 'Carte Fidélité', href: '/client/fidelite', icon: Gift },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter(); // Correct, but not strictly necessary, as you don't use `router.push` here.
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Déconnexion réussie");
    };

    const renderAuthButton = () => {
        if (isAuthenticated) {
            return (
                <div className="flex items-center gap-2">
                    {user?.role === "admin" && (
                        <Button variant="default" size="sm" asChild>
                            <Link href="/dashboard">
                                {/*<LogOut className="mr-2 h-4 w-4" />  Removed duplicate icon */}
                                Administrateur
                            </Link>
                        </Button>
                    )}
                    <Button variant="destructive" size="sm" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Déconnexion
                        {/* Removed the extra link and duplicate icon.  The button itself handles the logout. */}
                    </Button>
                </div>
            );
        }

        return (
            <Button variant="default" size="sm" asChild>
                <Link href="/client/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Connexion
                </Link>
            </Button>
        );
    };

    return (
        <nav className="bg-background border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/client" className="flex items-center">
                            <Film className="h-8 w-8 text-primary" />
                            <span className="ml-2 text-xl font-bold">Allciné</span>
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                            >
                                {item.name}
                            </Link>
                        ))}
                        {renderAuthButton()}
                        <ModeToggle />
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
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
                                className="flex items-center text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium"
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
        </nav>
    );
}