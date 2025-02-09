"use client"

import Link from "next/link"
import { Film, Newspaper, List, Tag as PriceTag, ThumbsUp, BookOpen, Gift, LogIn, Menu, X } from "lucide-react"
import { Button } from "@/components/client/ui/button"
import { useState } from "react"
import { ModeToggle } from "@/components/client/mode-toggle"

const navigation = [
  { name: 'Accueil', href: '/client/', icon: Film },
  { name: 'Actualités', href: '/client/actualites', icon: Newspaper },
  { name: 'Film/Serie/Manga', href: '/client/contentClient', icon: List },
  { name: 'Tarifs', href: '/client/tarifs', icon: PriceTag },
  { name: 'Recommandations', href: '/client/recommandations', icon: ThumbsUp },
  { name: 'Articles', href: '/client/articles', icon: BookOpen },
  { name: 'Carte Fidélité', href: '/client/fidelite', icon: Gift },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Film className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">MediaStore</span>
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
            <Button variant="default" size="sm" asChild>
              <Link href="/connexion">
                <LogIn className="mr-2 h-4 w-4" />
                Connexion
              </Link>
            </Button>
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
            <Button variant="default" className="w-full" asChild>
              <Link href="/connexion">
                <LogIn className="mr-2 h-4 w-4" />
                Connexion
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}