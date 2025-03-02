// pages/Articles.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookOpen, Search, Calendar, ArrowRight, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useGetArticlesQuery } from '@/lib/redux/api/articleApi'
import LoadingSpinner from "@/components/LoadingSpinner"
import { useDispatch } from 'react-redux'
import { addItem, setCartOpen } from '@/lib/redux/slices/cartSlice'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"

export default function Articles() {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedArticle, setSelectedArticle] = useState(null)
    const pageSize = 12
    const dispatch = useDispatch()

    const { data, isLoading } = useGetArticlesQuery({
        search: searchTerm,
        page: currentPage,
        limit: pageSize,
        sortBy: 'titre',
        sortOrder: 'asc'
    })

    const articles = data?.articles || []

    const handleAddToCart = (article) => {
        dispatch(addItem({
            type: 'article',
            id: article.id,
            titre: article.titre,
            prix: article.prix,
            quantite: 1
        }))
        dispatch(setCartOpen(true))
        toast.success('Article ajouté au panier')
    }

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <h1 className="text-4xl font-bold">Articles & Astuces</h1>
                <BookOpen className="h-8 w-8 text-yellow-500" />
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {articles.map((article) => (
                    <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative pt-[75%]">
                            {article.image ? (
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL_BASE}${article.image}`}
                                    alt={article.titre}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                    <BookOpen className="h-12 w-12 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium bg-yellow-600/10 text-yellow-500 px-2 py-1 rounded">
                                    {article.Category?.nom || 'Non catégorisé'}
                                </span>
                                <span className="text-sm text-muted-foreground flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date().toLocaleDateString("fr-FR")}
                                </span>
                            </div>
                            <CardTitle className="line-clamp-2">{article.titre}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Button
                                    onClick={() => setSelectedArticle(article)}
                                    className="w-full bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-600 hover:text-white"
                                >
                                    Lire l'article
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button
                                    onClick={() => handleAddToCart(article)}
                                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Ajouter au panier
                                    <ShoppingCart className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={selectedArticle !== null} onOpenChange={() => setSelectedArticle(null)}>
                {selectedArticle && (
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>{selectedArticle.titre}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                            {selectedArticle.image && (
                                <div className="relative w-full h-64 mb-4">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL_BASE}${selectedArticle.image}`}
                                        alt={selectedArticle.titre}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            )}
                            <p className="text-muted-foreground whitespace-pre-line">
                                {selectedArticle.description}
                            </p>
                        </div>
                    </DialogContent>
                )}
            </Dialog>

            {data?.pagination && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={!data.pagination.hasPreviousPage}
                        className="px-4 py-2 bg-yellow-600 text-white rounded disabled:opacity-50"
                    >
                        Précédent
                    </button>
                    <span className="px-4 py-2">
                        Page {data.pagination.currentPage} sur {data.pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={!data.pagination.hasNextPage}
                        className="px-4 py-2 bg-yellow-600 text-white rounded disabled:opacity-50"
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    )
}