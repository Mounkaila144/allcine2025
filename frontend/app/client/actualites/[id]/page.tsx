"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Tag, ThumbsUp } from "lucide-react"

const news = [
  {
    id: 1,
    title: "Nouvelle collection de films d'action",
    type: "film",
    genre: "action",
    date: "2024-03-20",
    content: `Découvrez notre nouvelle collection de films d'action, incluant les derniers blockbusters et les classiques du genre. Cette sélection comprend des films à grand spectacle, des scènes d'action époustouflantes et des effets spéciaux de dernière génération.

    Notre catalogue s'enrichit de titres prestigieux, offrant des heures de divertissement intense. Profitez de nos offres spéciales pour découvrir ces nouveautés.
    
    Chaque film a été soigneusement sélectionné pour sa qualité technique et son scénario captivant.`,
    popularity: "high"
  },
  {
    id: 2,
    title: "Séries exclusives du mois",
    type: "serie",
    genre: "drame",
    date: "2024-03-18",
    content: `Ne manquez pas nos séries exclusives ce mois-ci, avec des contenus inédits et des productions originales. Des drames intenses aux comédies légères, il y en a pour tous les goûts.

    Nous avons sélectionné les meilleures séries du moment, avec des intrigues captivantes et des personnages mémorables. Découvrez des histoires qui vous tiendront en haleine épisode après épisode.
    
    Profitez de nos offres spéciales pour binge-watcher vos séries préférées.`,
    popularity: "medium"
  },
  {
    id: 3,
    title: "Promotions sur les clés USB",
    type: "tech",
    genre: "promo",
    date: "2024-03-15",
    content: `Profitez de nos offres exceptionnelles sur les clés USB remplies de contenu. Des réductions importantes sont appliquées sur toute notre gamme de clés USB.

    Chaque clé est préchargée avec une sélection de films et séries en haute définition. Différentes capacités sont disponibles pour répondre à tous les besoins.
    
    Une occasion unique de constituer votre bibliothèque multimédia à prix réduit.`,
    popularity: "high"
  }
]

export default function NewsDetail() {
  const router = useRouter()
  const params = useParams()
  const id = parseInt(params.id as string)
  
  const newsItem = news.find(item => item.id === id)
  
  if (!newsItem) {
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
        Retour aux actualités
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{newsItem.title}</CardTitle>
          <div className="flex gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {new Date(newsItem.date).toLocaleDateString("fr-FR")}
            </div>
            <div className="flex items-center">
              <Tag className="mr-1 h-4 w-4" />
              {newsItem.type}
            </div>
            <div className="flex items-center">
              <ThumbsUp className="mr-1 h-4 w-4" />
              {newsItem.popularity === "high" ? "Populaire" : "Modéré"}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {newsItem.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}