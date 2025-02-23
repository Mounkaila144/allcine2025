"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, HardDrive, Film, Tv, Book } from "lucide-react" // Ajout de Book pour les mangas

const prices = {
    series: {
        title: "Séries TV (par saison)",
        icon: Tv,
        tiers: [
            { seasons: 1, price: 500 },
            { seasons: 2, price: 1000 },
            { seasons: 3, price: 1500 },
            { seasons: 4, price: 2000, bonus: " + 1 saison bonus gratuite au choix" }, // Bonus pour 4 saisons et plus
        ],
        description: "Profitez de vos séries préférées en qualité HD.",
        features: [
            "Qualité HD garantie",
            "Audio multilingue",
            "Sous-titres inclus",
        ],
        note: "Pour 4 saisons ou plus, bénéficiez d'une saison supplémentaire gratuite de la série de votre choix !"
    },
    films: {
        title: "Films",
        icon: Film,
        tiers: [
            { films: 1, price: 200, label: "1 film" }, // Prix pour 1 film
            { films: 3, price: 500, label: "3 films" }, // Prix pour 3 films
        ],
        description: "Découvrez notre large sélection de films HD.",
        features: [
            "Qualité HD garantie",
            "Audio multilingue",
            "Sous-titres inclus",
        ],
        note: "Choisissez parmi une variété de films récents et classiques."
    },
    mangas: {
        title: "Mangas (Packs d'épisodes)",
        icon: Book, // Icône pour les mangas
        tiers: [
            { episodes: 40, price: 500, label: "Pack 40 épisodes" }, // Prix pour 40 épisodes
        ],
        description: "Plongez dans l'univers des mangas avec nos packs d'épisodes.",
        features: [
            "Épisodes de qualité",
            "Sous-titres disponibles",
        ],
        note: "Packs de 40 épisodes pour une expérience manga complète."
    },
    usb: {
        title: "Offres Clés USB",
        icon: HardDrive,
        packs: [ // Utilisation de "packs" pour clarifier qu'il s'agit d'offres groupées
            { capacity: "8Go", price: 5000, content: "20 films HD" },
            { capacity: "16Go", price: 8000, content: "40 films HD", popular: true, bonusFilms: 5 }, // Indique "populaire" et ajoute bonusFilms
            { capacity: "32Go", price: 12000, content: "80 films HD" },
        ],
        description: "Emportez vos films et séries préférés partout avec nos clés USB.",
        features: [
            "Films pré-chargés",
            "Mise à jour gratuite",
            "Support technique inclus",
        ],
        note: "Le moyen idéal pour stocker et transporter vos contenus."
    },
    delivery: {
        price: 1000,
        description: "Livraison standard",
        note: "Frais de livraison fixes pour toute commande."
    }
};


export default function Tarifs() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-4xl font-bold mb-8">Nos Tarifs</h1>

            {/* Tarifs à l'unité - Séries */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">{prices.series.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {prices.series.tiers.map((tier, index) => (
                        <Card key={index} className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-yellow-600/10 rounded-full" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <prices.series.icon className="h-5 w-5 text-yellow-500" />
                                    {tier.seasons ? `${tier.seasons} saisons` : prices.series.title} {/* Affichage dynamique saisons/titre */}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold mb-4">
                                    {tier.price} <span className="text-lg">FCFA</span> {tier.bonus && <span className="text-sm text-green-500">{tier.bonus}</span>}
                                </p>
                                <ul className="space-y-2">
                                    {prices.series.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                {prices.series.note && <p className="mt-4 text-sm italic">{prices.series.note}</p>}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Tarifs à l'unité - Films */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">{prices.films.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {prices.films.tiers.map((tier, index) => (
                        <Card key={index} className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-yellow-600/10 rounded-full" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <prices.films.icon className="h-5 w-5 text-yellow-500" />
                                    {tier.label || prices.films.title} {/* Affichage label personnalisé ou titre */}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold mb-4">
                                    {tier.price} <span className="text-lg">FCFA</span>
                                </p>
                                <ul className="space-y-2">
                                    {prices.films.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                {prices.films.note && <p className="mt-4 text-sm italic">{prices.films.note}</p>}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Tarifs à l'unité - Mangas */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">{prices.mangas.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {prices.mangas.tiers.map((tier, index) => (
                        <Card key={index} className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-yellow-600/10 rounded-full" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <prices.mangas.icon className="h-5 w-5 text-yellow-500" />
                                    {tier.label || prices.mangas.title} {/* Affichage label personnalisé ou titre */}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold mb-4">
                                    {tier.price} <span className="text-lg">FCFA</span>
                                </p>
                                <ul className="space-y-2">
                                    {prices.mangas.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                {prices.mangas.note && <p className="mt-4 text-sm italic">{prices.mangas.note}</p>}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>


            {/* Offres Clés USB */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">{prices.usb.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {prices.usb.packs.map((pack, index) => (
                        <Card
                            key={index}
                            className={`relative overflow-hidden ${pack.popular ? "border-yellow" : ""}`}
                        >
                            {pack.popular && (
                                <div className="absolute top-0 left-0 bg-yellow-600 text-yellow-500-foreground px-3 py-1 rounded-br-lg text-sm">
                                    Plus populaire
                                </div>
                            )}
                            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-yellow-600/10 rounded-full" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <prices.usb.icon className="h-5 w-5 text-yellow-500" />
                                    Clé USB {pack.capacity}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold mb-4">
                                    {pack.price} <span className="text-lg">FCFA</span>
                                </p>
                                <ul className="space-y-2">
                                    {prices.usb.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>Capacité : {pack.capacity}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>{pack.content}</span>
                                    </li>
                                    {pack.bonusFilms && (
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>Bonus : {pack.bonusFilms} films offerts</span>
                                        </li>
                                    )}
                                </ul>
                                {prices.usb.note && <p className="mt-4 text-sm italic">{prices.usb.note}</p>}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Livraison */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Livraison</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-yellow-600/10 rounded-full" />
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <HardDrive className="h-5 w-5 text-yellow-500" /> {/* Icône générique, vous pouvez la changer */}
                                {prices.delivery.description}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold mb-4">
                                {prices.delivery.price} <span className="text-lg">FCFA</span>
                            </p>
                            {prices.delivery.note && <p className="mt-4 text-sm italic">{prices.delivery.note}</p>}
                        </CardContent>
                    </Card>
                </div>
            </section>


        </div>
    )
}