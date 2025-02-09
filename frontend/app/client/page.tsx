import { Button } from "@/components/client/ui/button"
import { Card, CardContent } from "@/components/client/ui/card"
import { Film, Monitor, Smartphone, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <Image
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
          alt="Hero background"
          fill
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

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Nos services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Film className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Films & Séries</h3>
                <p className="text-sm text-muted-foreground">
                  Large catalogue de films et séries en qualité HD
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Monitor className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Produits Tech</h3>
                <p className="text-sm text-muted-foreground">
                  Matériel informatique et accessoires de qualité
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Smartphone className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Mobile</h3>
                <p className="text-sm text-muted-foreground">
                  Application mobile pour accéder à vos contenus
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Fidélité</h3>
                <p className="text-sm text-muted-foreground">
                  Programme de fidélité avec des récompenses exclusives
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-muted py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">À la une</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Nouveaux Films",
                image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                description: "Découvrez les dernières sorties cinéma"
              },
              {
                title: "Séries Populaires",
                image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                description: "Les séries les plus regardées du moment"
              },
              {
                title: "Promos Tech",
                image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                description: "Équipements et accessoires en promotion"
              }
            ].map((item, index) => (
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
  )
}