"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/client/ui/card"
import { Input } from "@/components/client/ui/input"
import { Button } from "@/components/client/ui/button"
import { BookOpen, Search, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"

const articles = [
  {
    id: 1,
    title: "Comment choisir sa clé USB",
    category: "Tech",
    date: "2024-03-20",
    image: "https://images.unsplash.com/photo-1618410320928-25228d811631?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    preview: "Guide complet pour choisir la clé USB adaptée à vos besoins en stockage de films et séries..."
  },
  {
    id: 2,
    title: "Les meilleurs films de 2024",
    category: "Cinéma",
    date: "2024-03-18",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    preview: "Découvrez notre sélection des films incontournables de l'année 2024..."
  },
  {
    id: 3,
    title: "Séries à ne pas manquer",
    category: "Séries",
    date: "2024-03-15",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    preview: "Les séries les plus attendues et les pépites à découvrir absolument..."
  },
  {
    id: 4,
    title: "Optimiser son stockage",
    category: "Tech",
    date: "2024-03-12",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    preview: "Conseils et astuces pour gérer efficacement votre collection de films et séries..."
  }
]

export default function Articles() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold">Articles & Astuces</h1>
        <BookOpen className="h-8 w-8 text-primary" />
      </div>

      {/* Barre de recherche */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un article..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Liste des articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                  {article.category}
                </span>
                <span className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(article.date).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {article.preview}
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/articles/${article.id}`} className="flex items-center justify-center">
                  Lire l'article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}