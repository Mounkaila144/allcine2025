"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, HardDrive, Film, Tv } from "lucide-react"

const prices = {
  films: [
    { type: "Film HD", price: 500, icon: Film },
    { type: "Série (par saison)", price: 1000, icon: Tv },
    { type: "Pack 5 films", price: 2000, icon: Film },
  ],
  usb: [
    { capacity: "8Go", price: 5000, content: "20 films HD", icon: HardDrive },
    { capacity: "16Go", price: 8000, content: "40 films HD", icon: HardDrive },
    { capacity: "32Go", price: 12000, content: "80 films HD", icon: HardDrive },
  ]
}

export default function Tarifs() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Nos Tarifs</h1>

      {/* Tarifs à l'unité */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Tarifs à l'unité</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {prices.films.map((item, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-primary/10 rounded-full" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <item.icon className="h-5 w-5 text-primary" />
                  {item.type}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">
                  {item.price} <span className="text-lg">FCFA</span>
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Qualité HD garantie</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Audio multilingue</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Sous-titres inclus</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Offres Clés USB */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Offres Clés USB</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {prices.usb.map((item, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden ${index === 1 ? "border-primary" : ""}`}
            >
              {index === 1 && (
                <div className="absolute top-0 left-0 bg-primary text-primary-foreground px-3 py-1 rounded-br-lg text-sm">
                  Plus populaire
                </div>
              )}
              <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-primary/10 rounded-full" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <item.icon className="h-5 w-5 text-primary" />
                  Clé USB {item.capacity}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">
                  {item.price} <span className="text-lg">FCFA</span>
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Capacité : {item.capacity}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{item.content}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Mise à jour gratuite</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Support technique inclus</span>
                  </li>
                  {index === 1 && (
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Bonus : 5 films offerts</span>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}