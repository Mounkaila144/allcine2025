"use client"

import { useState } from "react"
import { Button } from "@/components/client/ui/button"
import { Input } from "@/components/client/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/client/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/client/ui/card"
import { Film, Tv, Monitor, Search, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const news = [
  {
    id: 1,
    title: "Nouvelle collection de films d'action",
    type: "film",
    genre: "action",
    date: "2024-03-20",
    preview: "Découvrez notre nouvelle collection de films d'action, incluant les derniers blockbusters...",
    popularity: "high"
  },
  {
    id: 2,
    title: "Séries exclusives du mois",
    type: "serie",
    genre: "drame",
    date: "2024-03-18",
    preview: "Ne manquez pas nos séries exclusives ce mois-ci, avec des contenus inédits...",
    popularity: "medium"
  },
  {
    id: 3,
    title: "Promotions sur les clés USB",
    type: "tech",
    genre: "promo",
    date: "2024-03-15",
    preview: "Profitez de nos offres exceptionnelles sur les clés USB remplies de contenu...",
    popularity: "high"
  },
  {
    id: 4,
    title: "Nouveaux films d'animation",
    type: "film",
    genre: "animation",
    date: "2024-03-14",
    preview: "Une sélection des meilleurs films d'animation pour toute la famille...",
    popularity: "high"
  },
  {
    id: 5,
    title: "Séries policières en promotion",
    type: "serie",
    genre: "policier",
    date: "2024-03-12",
    preview: "Découvrez notre collection de séries policières à prix réduit...",
    popularity: "medium"
  },
  {
    id: 6,
    title: "Offre spéciale accessoires",
    type: "tech",
    genre: "promo",
    date: "2024-03-10",
    preview: "Profitez de réductions sur notre gamme d'accessoires multimédia...",
    popularity: "low"
  }
]

const ITEMS_PER_PAGE = 4

export default function Actualites() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [genreFilter, setGenreFilter] = useState("all")
  const [popularityFilter, setPopularityFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesGenre = genreFilter === "all" || item.genre === genreFilter
    const matchesPopularity = popularityFilter === "all" || item.popularity === popularityFilter
    return matchesSearch && matchesType && matchesGenre && matchesPopularity
  })

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedNews = filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Actualités</h1>

      {/* Filtres et recherche */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9"
          />
        </div>
        
        <Select 
          value={typeFilter} 
          onValueChange={(value) => {
            setTypeFilter(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type de contenu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="film">Films</SelectItem>
            <SelectItem value="serie">Séries</SelectItem>
            <SelectItem value="tech">Tech</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={genreFilter} 
          onValueChange={(value) => {
            setGenreFilter(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les genres</SelectItem>
            <SelectItem value="action">Action</SelectItem>
            <SelectItem value="drame">Drame</SelectItem>
            <SelectItem value="promo">Promotions</SelectItem>
            <SelectItem value="animation">Animation</SelectItem>
            <SelectItem value="policier">Policier</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={popularityFilter} 
          onValueChange={(value) => {
            setPopularityFilter(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Popularité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="high">Haute</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="low">Basse</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des actualités */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {paginatedNews.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {item.type === "film" && <Film className="h-5 w-5" />}
                {item.type === "serie" && <Tv className="h-5 w-5" />}
                {item.type === "tech" && <Monitor className="h-5 w-5" />}
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{item.preview}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {new Date(item.date).toLocaleDateString("fr-FR")}
                </span>
                <Button variant="outline" asChild>
                  <Link href={`/actualites/${item.id}`}>Lire la suite</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}