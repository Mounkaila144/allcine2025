import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

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

const ContentFilters: React.FC<ContentFiltersProps> = ({
                                                           searchTerm,
                                                           setSearchTerm,
                                                           typeFilter,
                                                           setTypeFilter,
                                                           genreFilter,
                                                           setGenreFilter,
                                                           sortBy,
                                                           setSortBy,
                                                           setCurrentPage,
                                                       }) => {
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

            <Select value={sortBy} onValueChange={(value) => {
                setSortBy(value);
                setCurrentPage(1);
            }}>
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

export default ContentFilters;