import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchTMDBData } from "@/lib/tmdb";
import { fetchMangaData } from "@/lib/jikan";

export default function ContentForm({ onSubmit, initialData, onCancel }) {
    const [formData, setFormData] = useState(initialData);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    const handleTypeChange = (value) => {
        setFormData(prev => ({
            ...prev,
            type: value,
            saisons_possedees: value === 'serie' ? 1 : 0
        }));
        setSuggestions([]); // Reset suggestions when type changes
    };

    const handleTitleChange = async (e) => {
        const title = e.target.value;
        setFormData(prev => ({ ...prev, titre: title }));

        if (title.length >= 2) {
            setIsLoadingSuggestions(true);
            try {
                let suggestions = [];
                if (formData.type === 'manga') {
                    const mangaResults = await fetchMangaData(title);
                    if (mangaResults) {
                        suggestions = mangaResults.map(manga => ({
                            id: manga.id,
                            title: manga.title,
                            // On peut conserver "original_title" si vous le souhaitez pour affichage
                            original_title: manga.original_title,
                            releaseDate: manga.release_date,
                            posterPath: manga.poster_path, // Pour les mangas, vous utilisez directement l'URL de l'image
                            overview: manga.overview,
                            genre: manga.genres[0],
                            chapters: manga.chapters,
                            volumes: manga.volumes,
                            status: manga.status
                        }));
                    }
                } else if (formData.type === 'film' || formData.type === 'serie') {
                    const tmdbResults = await fetchTMDBData(title, formData.type);
                    if (tmdbResults) {
                        suggestions = tmdbResults.map(item => ({
                            id: item.id,
                            title: item.title,
                            original_title: item.original_title,
                            releaseDate: item.releaseDate,
                            posterPath: item.posterPath,
                            overview: item.overview,
                            score: item.score
                        }));
                    }
                }
                setSuggestions(suggestions);
            } catch (error) {
                console.error('Erreur lors de la récupération des suggestions:', error);
            } finally {
                setIsLoadingSuggestions(false);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionSelect = (suggestion) => {
        setFormData(prev => ({
            ...prev,
            titre: suggestion.title,
            tmdb_id: formData.type !== 'manga' ? suggestion.id.toString() : null,
            description: suggestion.overview,
            image_url: formData.type === 'manga'
                ? suggestion.posterPath
                : suggestion.posterPath ? `https://image.tmdb.org/t/p/w500${suggestion.posterPath}` : null,
            release_date: suggestion.releaseDate || prev.release_date,
            genre: suggestion.genre || prev.genre,
            status: suggestion.status,
            chapters_count: suggestion.chapters || 0,
            volumes_count: suggestion.volumes || 0,
            language: 'ja', // Par défaut pour les mangas
            production_country: 'JP'
        }));
        setSuggestions([]);
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
            <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                    <SelectTrigger className="bg-blue-950/50 border-blue-900/30 text-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-950 border-blue-900/30 text-white">
                        <SelectItem value="film">Film</SelectItem>
                        <SelectItem value="serie">Série</SelectItem>
                        <SelectItem value="manga">Manga</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="relative">
                <Label htmlFor="titre">Titre</Label>
                <Input
                    id="titre"
                    name="titre"
                    value={formData.titre}
                    onChange={handleTitleChange}
                    className="bg-blue-950/50 border-blue-900/30 text-white"
                    required
                />

                {isLoadingSuggestions && (
                    <div className="absolute z-10 w-full mt-1 bg-blue-950 border border-blue-900/30 rounded-md p-2">
                        Chargement...
                    </div>
                )}

                {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-blue-950 border border-blue-900/30 rounded-md max-h-80 overflow-y-auto">
                        {suggestions.slice(0, 5).map((suggestion) => (
                            <div
                                key={suggestion.id}
                                className="p-2 hover:bg-blue-900/50 cursor-pointer flex items-start space-x-2 border-b border-blue-900/30"
                                onClick={() => handleSuggestionSelect(suggestion)}
                            >
                                {suggestion.posterPath && (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w92${suggestion.posterPath}`}
                                        alt={suggestion.title}
                                        className="w-16 h-20 object-cover rounded"
                                    />
                                )}
                                <div className="flex-1">
                                    <div className="font-medium text-white">{suggestion.title}</div>
                                    {suggestion.original_title !== suggestion.title && (
                                        <div className="text-sm text-gray-400">
                                            Titre original : {suggestion.original_title}
                                        </div>
                                    )}
                                    <div className="text-sm text-gray-400 mt-1">
                                        {suggestion.releaseDate?.split('-')[0]}
                                        {suggestion.chapters && (
                                            <span className="ml-2">
                                {suggestion.chapters} chapitres
                            </span>
                                        )}
                                        {suggestion.volumes && (
                                            <span className="ml-2">
                                • {suggestion.volumes} volumes
                            </span>
                                        )}
                                    </div>
                                    {suggestion.authors && (
                                        <div className="text-sm text-gray-400">
                                            Par {suggestion.authors}
                                        </div>
                                    )}
                                    {suggestion.score && (
                                        <div className="text-sm text-yellow-400 mt-1">
                                            Note : {suggestion.score}/10
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}



                {formData.type === 'serie' && (
                <div>
                    <Label htmlFor="saisons_possedees">Saisons possédées</Label>
                    <Input
                        id="saisons_possedees"
                        name="saisons_possedees"
                        type="number"
                        min="0"
                        value={formData.saisons_possedees}
                        onChange={(e) => setFormData(prev => ({ ...prev, saisons_possedees: parseInt(e.target.value) }))}
                        className="bg-blue-950/50 border-blue-900/30 text-white"
                    />
                </div>
            )}

            <div>
                <Label htmlFor="genre">Genre</Label>
                <Input
                    id="genre"
                    name="genre"
                    value={formData.genre || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                    className="bg-blue-950/50 border-blue-900/30 text-white"
                />
            </div>

            <div>
                <Label htmlFor="release_date">Date de sortie</Label>
                <Input
                    id="release_date"
                    name="release_date"
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, release_date: e.target.value }))}
                    className="bg-blue-950/50 border-blue-900/30 text-white"
                />
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Annuler
                </Button>
                <Button type="submit" className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                    {initialData.id ? 'Mettre à jour' : 'Ajouter'}
                </Button>
            </div>
            </div>
        </form>

    );
}