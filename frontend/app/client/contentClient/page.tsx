"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Film, Tv, Book, Search, ChevronLeft, ChevronRight, X, ShoppingCart, Badge} from "lucide-react";
import Image from "next/image";
import { useGetContentsQuery } from "@/lib/redux/api/contentsApi";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import { addItem } from "@/lib/redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
    Checkbox
} from "@/components/ui/checkbox"
import { Separator } from "@radix-ui/react-separator";

const ITEMS_PER_PAGE = 10;

// Define types and interfaces to improve type safety and readability

interface Season {
    id: number;
    number: number;
    episode_start?: number;
    episode_end?: number;
}

interface Content {
    id: number;
    titre: string;
    type: 'film' | 'serie' | 'manga';
    image_url?: string;
    genre: string;
    release_date?: string;
    average_rating?: number;
    saisons_possedees?: number;
    duration_minutes?: number;
    description?: string;
    saisons?: Season[]; // Assurez-vous que votre interface Content inclut les saisons
    est_par_saison?: boolean; // Add est_par_saison to Content interface
}

interface ContentFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    typeFilter: string;
    setTypeFilter: (filter: string) => void;
    genreFilter: string;
    setGenreFilter: (filter: string) => void;
    sortBy: string;
    setSortBy: (sortBy: string) => void;
    setCurrentPage: (page: number) => void;
}

const ContentFilters: React.FC<ContentFiltersProps> = ({ searchTerm, setSearchTerm, typeFilter, setTypeFilter, genreFilter, setGenreFilter, sortBy, setSortBy, setCurrentPage, }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="pl-9"
                />
            </div>

            <Select
                value={typeFilter}
                onValueChange={(value) => {
                    setTypeFilter(value);
                    setCurrentPage(1);
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
                    setGenreFilter(value);
                    setCurrentPage(1);
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les genres</SelectItem>
                    <SelectItem value="Action">Action</SelectItem>
                    <SelectItem value="Aventure">Aventure</SelectItem>
                    <SelectItem value="Animation">Animation</SelectItem>
                    <SelectItem value="Comédie">Comédie</SelectItem>
                    <SelectItem value="Crime">Crime</SelectItem>
                    <SelectItem value="Documentaire">Documentaire</SelectItem>
                    <SelectItem value="Drame">Drame</SelectItem>
                    <SelectItem value="Famille">Famille</SelectItem>
                    <SelectItem value="Fantastique">Fantastique</SelectItem>
                    <SelectItem value="Histoire">Histoire</SelectItem>
                    <SelectItem value="Horreur">Horreur</SelectItem>
                    <SelectItem value="Musique">Musique</SelectItem>
                    <SelectItem value="Mystère">Mystère</SelectItem>
                    <SelectItem value="Romance">Romance</SelectItem>
                    <SelectItem value="Science-Fiction">Science-Fiction</SelectItem>
                    <SelectItem value="Thriller">Thriller</SelectItem>
                    <SelectItem value="Guerre">Guerre</SelectItem>
                    <SelectItem value="Western">Western</SelectItem>
                    <SelectItem value="Film TV">Film TV</SelectItem>
                </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                    <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="titre">Titre</SelectItem>
                    <SelectItem value="rating">Note</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};


interface ContentCardProps {
    item: Content;
    onOpenModal: (content: Content) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onOpenModal }) => {
    const dispatch = useDispatch();

    const handleAddToCartFilm = () => {
        dispatch(
            addItem({
                id: item.id,
                type: 'content',
                titre: item.titre,
                prix: 200, // Prix fixe pour un film
                quantite: 1,
                contentDetails: {
                    type: 'film',
                }
            })
        );
        toast.success("Film ajouté au panier !");
    };

    const handleAddToCart = () => {
        if (item.type === "film") {
            handleAddToCartFilm();
        } else {
            // Ouvre la modal de détails pour séries et mangas
            onOpenModal(item);
        }
    };

    return (
        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col w-full mx-auto">
            <div className="relative w-full pt-[100%]">
                {item.image_url ? (
                    <Image
                        src={item.image_url}
                        alt={item.titre}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
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
            <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                     <span className="text-xs text-muted-foreground">
                         {item.genre} {item.release_date && `(${new Date(item.release_date).getFullYear()})`}
                     </span>
                    {item.average_rating && (
                        <span className="text-xs bg-yellow-600/10 text-yellow-500 px-2 py-1 rounded">
                             ★ {item.average_rating.toFixed(1)}
                         </span>
                    )}
                </div>
                <div className="flex justify-between items-center">
                    {item.type === "serie" && (
                        <span className="text-xs">
                             {item.saisons_possedees} saison{item.saisons_possedees > 1 ? "s" : ""}
                         </span>
                    )}
                    {/* Bouton Ajouter au panier (gère les films directement, ouvre la modale pour séries/mangas) */}
                    {item.type === "serie" || item.type === "manga" ? (
                        <Button size="sm" variant="outline" onClick={handleAddToCart}>
                            Voir plus ...
                        </Button>
                    ) : (
                        <Button size="sm" variant="outline" onClick={handleAddToCart}>
                            Ajouter au panier
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};


interface ContentGridProps {
    sortedContents: Content[];
    onOpenModal: (content: Content) => void;
}

const ContentGrid: React.FC<ContentGridProps> = ({ sortedContents, onOpenModal }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {sortedContents.map((item) => (
                <ContentCard key={item.id} item={item} onOpenModal={onOpenModal} />
            ))}
        </div>
    );
};


interface ContentModalProps {
    isModalOpen: boolean;
    onCloseModal: () => void;
    selectedContent: Content | null;
}


const ContentModal: React.FC<ContentModalProps> = ({ isModalOpen, onCloseModal, selectedContent }) => {
    const [selectedSeasons, setSelectedSeasons] = useState<number[]>([]); // Stocke les numéros directement
    const [mangaStart, setMangaStart] = useState<number>(0);
    const [mangaEnd, setMangaEnd] = useState<number>(0);
    const dispatch = useDispatch();


    const handleSeasonChange = (seasonNumber: number) => {
        setSelectedSeasons(prev =>
            prev.includes(seasonNumber)
                ? prev.filter(n => n !== seasonNumber)
                : [...prev, seasonNumber]
        );
    };


    const handleMangaRangeChange = (start: number, end: number) => {
        setMangaStart(start);
        setMangaEnd(end);
    };

    const handleAddToCart = () => {
        if (!selectedContent) return;

        if (selectedContent.type === "serie") {
            if (selectedSeasons.length === 0) {
                toast.error("Veuillez sélectionner au moins une saison.");
                return;
            }

            const seasonsToAdd = selectedContent.saisons?.filter((s: Season) =>
                selectedSeasons.includes(s.id)
            ) || [];

            dispatch(
                addItem({
                    id: selectedContent.id,
                    type: 'content',
                    titre: selectedContent.titre,
                    prix: 0,
                    quantite: 1,
                    contentDetails: {
                        type: 'serie',
                        classification: 'season', // Ajout de la classification pour les series
                        saisons: selectedSeasons.map(number => ({ number })), // Format clé "number"
                    },
                })
            );
            toast.success("Série ajoutée au panier !");

        } else if (selectedContent.type === "manga") {
            if (selectedContent.est_par_saison) { // Check est_par_saison for manga
                // Manga classé par saison
                if (selectedSeasons.length === 0) {
                    toast.error("Veuillez sélectionner au moins une saison.");
                    return;
                }
                const seasonsToAdd = selectedSeasons.map(number => ({ number })); // Format simple pour les saisons
                dispatch(
                    addItem({
                        id: selectedContent.id,
                        type: 'content',
                        titre: selectedContent.titre,
                        prix: 0,
                        quantite: 1,
                        contentDetails: {
                            type: 'manga',
                            classification: 'season', // Classification manga par saison
                            saisons: seasonsToAdd,
                        },
                    })
                );
            } else {
                // Manga classé par épisode
                if (mangaStart <= 0 || mangaEnd <= 0 || mangaEnd <= mangaStart) {
                    toast.error("Selectionner un intervalle d'épisode valide.");
                    return
                }
                dispatch(
                    addItem({
                        id: selectedContent.id,
                        type: 'content',
                        titre: selectedContent.titre,
                        prix: 0,
                        quantite: 1,
                        contentDetails: {
                            type: 'manga',
                            classification: 'episode', // Classification manga par episode
                            episodeStart: mangaStart,
                            episodeEnd: mangaEnd,
                        },
                    })
                );
            }
            toast.success("Manga ajouté au panier !");
        }
        onCloseModal();
        // Réinitialisez les sélections après l'ajout
        setSelectedSeasons([]);
        setMangaStart(0);
        setMangaEnd(0);
    };


    if (!selectedContent) return null;

    return (
        <Dialog open={isModalOpen} onOpenChange={onCloseModal}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {selectedContent?.type === "film" && <Film className="h-4 w-4" />}
                        {selectedContent?.type === "serie" && <Tv className="h-4 w-4" />}
                        {selectedContent?.type === "manga" && <Book className="h-4 w-4" />}
                        {selectedContent?.titre}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    {selectedContent?.image_url && (
                        <div className="relative w-full pt-[75%]">
                            <Image
                                src={selectedContent.image_url}
                                alt={selectedContent.titre}
                                fill
                                className="object-contain"
                                sizes="(max-width: 640px) 100vw, 600px"
                                priority
                            />
                        </div>
                    )}
                    <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{selectedContent?.genre}</span>
                        <span>
                             {selectedContent?.release_date && new Date(selectedContent.release_date).getFullYear()}
                         </span>
                        {selectedContent?.duration_minutes && (
                            <span>{selectedContent.duration_minutes} min</span>
                        )}
                    </div>
                    {selectedContent?.description && (
                        <DialogDescription className="text-foreground">
                            {selectedContent.description}
                        </DialogDescription>
                    )}

                    {selectedContent?.type === "serie" && (
                        <div className="mt-4">
                            <h4 className="font-semibold text-sm">Saisons disponibles ({selectedContent.saisons_possedees}):</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {/* Générer les saisons de 1 à saisons_possedees */}
                                {Array.from({ length: selectedContent.saisons_possedees }, (_, i) => i + 1).map((seasonNumber) => (
                                    <div key={seasonNumber} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`season-${seasonNumber}`}
                                            checked={selectedSeasons.includes(seasonNumber)}
                                            onCheckedChange={() => handleSeasonChange(seasonNumber)}
                                        />
                                        <label htmlFor={`season-${seasonNumber}`} className="text-sm">
                                            Saison {seasonNumber}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedContent?.type === "manga" && selectedContent.est_par_saison === true && ( // Condition for manga par saison
                        <div className="mt-4">
                            <h4 className="font-semibold text-sm">Saisons disponibles ({selectedContent.saisons_possedees}):</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {/* Générer les saisons de 1 à saisons_possedees */}
                                {Array.from({ length: selectedContent.saisons_possedees }, (_, i) => i + 1).map((seasonNumber) => (
                                    <div key={seasonNumber} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`season-manga-${seasonNumber}`}
                                            checked={selectedSeasons.includes(seasonNumber)}
                                            onCheckedChange={() => handleSeasonChange(seasonNumber)}
                                        />
                                        <label htmlFor={`season-manga-${seasonNumber}`} className="text-sm">
                                            Saison {seasonNumber}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {selectedContent?.type === "manga" && selectedContent.est_par_saison === false && ( // Condition for manga par episode
                        <div className="mt-4">
                            <h4 className="font-semibold text-sm">Selectionner Intervalles d'épisodes:</h4>
                            <div className="flex gap-2 items-center mt-2">
                                <Input
                                    type="number"
                                    placeholder="Début"
                                    className="w-24 bg-gray-100"
                                    value={mangaStart > 0 ? mangaStart : ""}
                                    onChange={(e) => setMangaStart(Number(e.target.value))}
                                />
                                <span className="mx-2">à</span>
                                <Input
                                    type="number"
                                    placeholder="Fin"
                                    className="w-24 bg-gray-100"
                                    value={mangaEnd > 0 ? mangaEnd : ""}
                                    onChange={(e) => setMangaEnd(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    )}


                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">
                                Fermer
                            </Button>
                        </DialogClose>
                        <Button
                            variant="default"
                            onClick={handleAddToCart}
                            disabled={
                                (selectedContent?.type === "serie" && selectedSeasons.length === 0) ||
                                (selectedContent?.type === "manga" && selectedContent.est_par_saison === true && selectedSeasons.length === 0) || // Condition for manga par saison
                                (selectedContent?.type === "manga" && selectedContent.est_par_saison === false && (mangaStart <= 0 || mangaEnd <= 0 || mangaEnd <= mangaStart)) // Condition for manga par episode
                            }
                        >
                            Ajouter au panier
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};


interface PaginationProps {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    isMobile: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, setCurrentPage, totalPages, totalItems, itemsPerPage, isMobile, }) => {
    const getVisiblePageNumbers = () => {
        if (!totalPages) return [];

        const delta = isMobile ? 1 : 2;
        const range = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            range.unshift("...");
        }
        if (currentPage + delta < totalPages - 1) {
            range.push("...");
        }

        if (totalPages > 1) {
            range.unshift(1);
            if (range[range.length - 1] !== totalPages) {
                range.push(totalPages);
            }
        }

        return range;
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center items-center gap-2">
                <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    size="sm"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {getVisiblePageNumbers().map((pageNumber, index) =>
                    pageNumber === "..." ? (
                        <span key={`ellipsis-${index}`} className="px-2">
                             ...
                         </span>
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
                )}

                <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    size="sm"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="text-sm text-muted-foreground text-center">
                Affichage de {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} -{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} sur {totalItems} résultats
            </div>
        </div>
    );
};


export default function ContentClient() {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [genreFilter, setGenreFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("titre");
    const [isMobile, setIsMobile] = useState(false);
    const [selectedContent, setSelectedContent] = useState<Content | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const queryFilters = {
        ...(searchTerm.length >= 3 && { search: searchTerm }),
        ...(typeFilter !== "all" && { type: typeFilter }),
        ...(genreFilter !== "all" && { genre: genreFilter }),
        page: currentPage,
        limit: ITEMS_PER_PAGE,
    };


    const { data, isLoading, error } = useGetContentsQuery(queryFilters);
    const contents = data?.contents || [];
    const totalItems = data?.totalItems || 0;
    const totalPages = data?.totalPages || 0;


    const sortedContents = [...contents].sort((a, b) => {
        if (sortBy === "rating") return (b.average_rating || 0) - (a.average_rating || 0);
        return a.titre.localeCompare(b.titre);
    });


    const handleOpenModal = (content: Content) => {
        setSelectedContent(content);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedContent(null);
    };


    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-yellow-500">Une erreur est survenue lors du chargement des contenus.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ContentFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                genreFilter={genreFilter}
                setGenreFilter={setGenreFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                setCurrentPage={setCurrentPage}
            />

            {isLoading && <LoadingSpinner />}

            <ContentGrid sortedContents={sortedContents} onOpenModal={handleOpenModal} />


            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                isMobile={isMobile}
            />

            <ContentModal
                isModalOpen={isModalOpen}
                onCloseModal={handleCloseModal}
                selectedContent={selectedContent}
            />
        </div>
    );
}