"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Film, Tv, Book, Search, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useGetContentsQuery } from '@/lib/redux/api/contentsApi'

const ITEMS_PER_PAGE = 10

export default function ContentClient() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [genreFilter, setGenreFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("titre")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const queryFilters = {
    ...(searchTerm.length >= 3 && { search: searchTerm }),
    ...(typeFilter !== "all" && { type: typeFilter }),
    page: currentPage,
    limit: ITEMS_PER_PAGE
  }

  const { data, isLoading, error } = useGetContentsQuery(queryFilters)
  const contents = data?.contents || []
  const totalItems = data?.totalItems || 0
  const totalPages = data?.totalPages || 0

  const sortedContents = [...contents].sort((a, b) => {
    if (sortBy === "rating") return (b.average_rating || 0) - (a.average_rating || 0)
    return a.titre.localeCompare(b.titre)
  })

  // Fonction pour générer les numéros de page visibles
  const getVisiblePageNumbers = () => {
    if (!totalPages) return []

    const delta = isMobile ? 1 : 2
    const range = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      range.unshift("...")
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...")
    }

    if (totalPages > 1) {
      range.unshift(1)
      if (range[range.length - 1] !== totalPages) {
        range.push(totalPages)
      }
    }

    return range
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>
  }

  if (error) {
    return <div className="text-red-500">Une erreur est survenue lors du chargement des contenus.</div>
  }

  return (
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Catalogue</h1>

        {/* Filtres */}
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
              <SelectItem value="manga">Mangas</SelectItem>
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
              <SelectItem value="science-fiction">Science-fiction</SelectItem>
              <SelectItem value="fantaisie">Fantaisie</SelectItem>
            </SelectContent>
          </Select>

          <Select
              value={sortBy}
              onValueChange={setSortBy}
          >
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="titre">Titre</SelectItem>
              <SelectItem value="rating">Note</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grille de contenu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {sortedContents.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  {item.image_url ? (
                      <Image
                          src={item.image_url}
                          alt={item.titre}
                          fill
                          className="object-cover"
                      />
                  ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        Pas d'image
                      </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {item.type === "film" && <Film className="h-4 w-4" />}
                    {item.type === "serie" && <Tv className="h-4 w-4" />}
                    {item.type === "manga" && <Book className="h-4 w-4" />}
                    {item.titre}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-foreground">
                  {item.genre} {item.release_date && `(${new Date(item.release_date).getFullYear()})`}
                </span>
                    {item.average_rating && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    ★ {item.average_rating.toFixed(1)}
                  </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    {item.type === "serie" && (
                        <span className="text-xs">
                    {item.saisons_possedees} saison{item.saisons_possedees > 1 ? 's' : ''}
                  </span>
                    )}
                    <Button size="sm" variant="outline">Voir plus</Button>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex flex-wrap justify-center items-center gap-2">
                <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getVisiblePageNumbers().map((pageNumber, index) => (
                    pageNumber === "..." ? (
                        <span key={`ellipsis-${index}`} className="px-2">...</span>
                    ) : (
                        <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            onClick={() => setCurrentPage(Number(pageNumber))}
                            size="sm"
                            className="min-w-[32px]"
                        >
                          {pageNumber}
                        </Button>
                    )
                ))}

                <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    size="sm"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-muted-foreground text-center">
                Affichage de {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalItems)}
                {' '}-{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} sur {totalItems} résultats
              </div>
            </div>
        )}
      </div>
  )
}