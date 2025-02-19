// app/client/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Film, Monitor, Smartphone, Star, BookOpen } from "lucide-react"; //added BookOpen
import Image from "next/image";
import Link from "next/link";


const SERVICES = [
  {
    icon: Film,
    title: "Films & Séries",
    description: "Large catalogue de films et séries en qualité HD",
    color: "text-yellow-500" // Add color for icon
  },
  {
    icon: BookOpen, // Changed to BookOpen for Manga
    title: "Manga",
    description: "Large catalogue de Manga ",
    color: "text-yellow-500"
  },

  {
    icon: Monitor,
    title: "Produits Tech",
    description: "Matériel informatique et accessoires de qualité",
    color: "text-yellow-500"
  },
  {
    icon: Star,
    title: "Fidélité",
    description: "Programme de fidélité avec des récompenses exclusives",
    color: "text-yellow-500"
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
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-600 text-white" asChild>
                  <Link href="/client/contentClient">Explorer les films</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-yellow-500 hover:bg-yellow-600 hover:text-white" asChild>
                  <Link href="/client/contentClient">Voir les nouveautés</Link>
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
                      <service.icon className={`h-12 w-12 mx-auto mb-4 ${service.color}`} /> {/* Apply color here */}
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
      </div>
  );
}