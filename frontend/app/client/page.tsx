// app/client/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Film, Monitor, Smartphone, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FEATURED_ITEMS = [
  {
    title: "Nouveaux Films test",
    description: "Découvrez les dernières sorties cinéma",
    image: "/images/movies.jpg" // Déplacez les images en local
  },
  {
    title: "Séries Populaires",
    description: "Les séries les plus regardées du moment",
    image: "/images/series.jpg"
  },
  {
    title: "Promos Tech",
    description: "Équipements et accessoires en promotion",
    image: "/images/tech.jpg"
  }
];

const SERVICES = [
  {
    icon: Film,
    title: "Films & Séries",
    description: "Large catalogue de films et séries en qualité HD"
  },
  {
    icon: Monitor,
    title: "Produits Tech",
    description: "Matériel informatique et accessoires de qualité"
  },
  {
    icon: Smartphone,
    title: "Mobile",
    description: "Application mobile pour accéder à vos contenus"
  },
  {
    icon: Star,
    title: "Fidélité",
    description: "Programme de fidélité avec des récompenses exclusives"
  }
];

export default function ClientHome() {
  return (
      <div className="flex flex-col gap-12">
        {/* Hero Section */}
        <section className="relative h-[600px]">
          <Image
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
              alt="Hero background"
              fill
              priority
              className="object-cover brightness-50"
          />
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Votre univers multimédia
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                Découvrez notre sélection de films, séries et produits informatiques
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/catalogue">Explorer le catalogue</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10" asChild>
                  <Link href="/actualites">Voir les nouveautés</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-center mb-12">Nos services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <service.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </section>

        {/* Featured Section */}
        <section className="bg-muted py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">À la une</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FEATURED_ITEMS.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative h-48">
                      <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {item.description}
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/catalogue">En savoir plus</Link>
                      </Button>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
  );
}