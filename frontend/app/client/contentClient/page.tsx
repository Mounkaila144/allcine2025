// page contentclient.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useGetContentsQuery } from "@/lib/redux/api/contentsApi";
import LoadingSpinner from "@/components/LoadingSpinner";
import ContentFilters from "@/components/ContentFilters"; // Import ContentFilters
import ContentGrid from "@/components/ContentGrid"; // Import ContentGrid
import ContentModal from "@/components/ContentModal"; // Import ContentModal
import Pagination from "@/components/Pagination"; // Import Pagination

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
    saisons?: Season;
    est_par_saison?: boolean;
}

export default function ContentClient() {
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
    }, []); // Ajouter un tableau de dépendances vide

    const queryFilters = {
        ...(searchTerm.length >= 3 && { search: searchTerm }),
        ...(typeFilter!== "all" && { type: typeFilter }),
        ...(genreFilter!== "all" && { genre: genreFilter }),
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