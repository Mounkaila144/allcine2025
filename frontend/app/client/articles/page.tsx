"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { useGetArticlesQuery } from '@/lib/redux/api/articleApi'
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Articles() {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    const { data, isLoading } = useGetArticlesQuery({
        search: searchTerm,
        page: currentPage,
        limit: pageSize,
        sortBy: 'titre',
        sortOrder: 'asc'
    })

    const articles = data?.articles || []

    if (isLoading) {
        return <LoadingSpinner />
    }

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
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="pl-9"
                />
            </div>

            {/* Liste des articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                    <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-48">
                            {article.image ? (
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL_BASE}${article.image}`}
                                    alt={article.titre}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <BookOpen className="h-12 w-12 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                  {article.Category?.nom || 'Non catégorisé'}
                </span>
                                <span className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                                    {new Date().toLocaleDateString("fr-FR")}
                </span>
                            </div>
                            <CardTitle>{article.titre}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                {article.description}
                            </p>
                            <Link
                                href={`/articles/${article.id}`}
                                className="flex items-center justify-center w-full bg-transparent border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 py-2 px-4 rounded"
                            >
                                Lire l'article
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination basique */}
            {data?.pagination && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={!data.pagination.hasPreviousPage}
                        className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
                    >
                        Précédent
                    </button>
                    <span className="px-4 py-2">
            Page {data.pagination.currentPage} sur {data.pagination.totalPages}
          </span>
                    <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={!data.pagination.hasNextPage}
                        className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    )
}