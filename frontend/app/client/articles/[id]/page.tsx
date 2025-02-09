"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/client/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/client/ui/card"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import Image from "next/image"

const articles = [
  {
    id: 1,
    title: "Comment choisir sa clé USB",
    category: "Tech",
    date: "2024-03-20",
    image: "https://images.unsplash.com/photo-1618410320928-25228d811631?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    content: `Choisir la bonne clé USB pour stocker vos films et séries est essentiel. Voici un guide complet pour vous aider à faire le meilleur choix.

    Capacité de stockage
    La première chose à considérer est la capacité de stockage. Voici quelques repères :
    - Un film HD occupe environ 2 Go
    - Une saison de série environ 8 Go
    - Privilégiez les capacités de 32 Go minimum pour une collection confortable

    Vitesse de transfert
    La vitesse est cruciale pour transférer vos fichiers rapidement :
    - USB 3.0 ou supérieur recommandé
    - Vérifiez les débits en lecture/écriture
    - Évitez les clés USB 2.0 trop lentes

    Fiabilité et durabilité
    Pour protéger vos précieux contenus :
    - Choisissez des marques reconnues
    - Vérifiez les garanties
    - Optez pour des modèles robustes

    Notre sélection
    Nous proposons différentes capacités adaptées à vos besoins :
    - 8 Go : pour débuter (20 films)
    - 16 Go : collection moyenne (40 films)
    - 32 Go : collection importante (80 films)

    Chaque clé est préchargée avec une sélection de films en HD et bénéficie d'une garantie de 2 ans.`
  },
  {
    id: 2,
    title: "Les meilleurs films de 2024",
    category: "Cinéma",
    date: "2024-03-18",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    content: `Découvrez notre sélection des films incontournables de l'année 2024. Une année riche en émotions et en spectacle.

    Les blockbusters
    - Les suites très attendues
    - Les nouvelles franchises prometteuses
    - Les adaptations de romans à succès

    Les films d'auteur
    - Les pépites du cinéma indépendant
    - Les révélations de l'année
    - Les films primés dans les festivals

    Les films d'animation
    - Les productions des grands studios
    - Les œuvres innovantes
    - Les films pour toute la famille

    Notre top 10 détaillé
    Retrouvez nos critiques complètes et nos recommandations pour chaque film.`
  }
]

// This function is required for static site generation with dynamic routes
export function generateStaticParams() {
  return articles.map((article) => ({
    id: article.id.toString(),
  }))
}

export default function ArticleDetail() {
  const router = useRouter()
  const params = useParams()
  const id = parseInt(params.id as string)
  
  const article = articles.find(item => item.id === id)
  
  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
        <Button onClick={() => router.back()}>Retour</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux articles
      </Button>
      
      <Card>
        <div className="relative h-64 w-full">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
              {article.category}
            </span>
            <span className="text-sm text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(article.date).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <CardTitle className="text-3xl">{article.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {article.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}