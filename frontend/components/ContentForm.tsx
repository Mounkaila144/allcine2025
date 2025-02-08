import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchTMDBData } from "@/lib/tmdb";
import { fetchMangaData } from "@/lib/jikan";

export default function ContentForm({ onSubmit, initialData, onCancel, readOnly = false }) {
    const [formData, setFormData] = useState(initialData);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    const genreMapping = {
        28: 'Action',
        12: 'Aventure',
        16: 'Animation',
        35: 'Comédie',
        80: 'Crime',
        99: 'Documentaire',
        18: 'Drame',
        10751: 'Famille',
        14: 'Fantastique',
        36: 'Histoire',
        27: 'Horreur',
        10402: 'Musique',
        9648: 'Mystère',
        10749: 'Romance',
        878: 'Science-Fiction',
        10770: 'Film TV',
        53: 'Thriller',
        10752: 'Guerre',
        37: 'Western'
    };

    const handleTypeChange = (value) => {
        setFormData(prev => ({
            ...prev,
            type: value,
            saisons_possedees: value === 'serie' ? 1 : 0
        }));
        setSuggestions([]);
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
                            original_title: manga.original_title,
                            releaseDate: manga.release_date,
                            posterPath: manga.poster_path,
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
                            title: item.title || item.name,
                            original_title: item.original_title || item.original_name,
                            releaseDate: item.releaseDate,
                            posterPath: item.posterPath,
                            overview: item.overview,
                            vote_average: item.vote_average, // Gardons le même nom
                            genre_ids: item.genre_ids || [], // Conserver les IDs des genres
                            genres: item.genre_ids ? item.genre_ids.map(id => genreMapping[id]).filter(Boolean) : [], // Convertir en noms de genres
                            status: '',
                            chapters: 0,
                            volumes: 0
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
            // Utilisez les genres mappés pour films/séries ou le genre direct pour manga
            genre: formData.type === 'manga'
                ? suggestion.genre
                : suggestion.genres?.join(', ') || '',
            status: suggestion.status,
            rating: suggestion.vote_average, // Convertit en string
            chapters_count: suggestion.chapters || 0,
            volumes_count: suggestion.volumes || 0,
            language: formData.type === 'manga' ? 'ja' : 'fr',
            production_country: formData.type === 'manga' ? 'JP' : 'FR'
        }));
        setSuggestions([]);
    };

    // Fonction utilitaire pour mettre à jour un champ générique
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="h-[600px] overflow-y-auto p-4 bg-gray-800 rounded">

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
            {/* Type */}
            <div>
                <Label htmlFor="type">Type</Label>
                {readOnly ? (
                    <div className="text-white">{formData.type}</div>
                ) : (
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
                )}
            </div>

            {/* Titre */}
            <div className="relative">
                <Label htmlFor="titre">Titre</Label>
                {readOnly ? (
                    <div className="text-white">{formData.titre}</div>
                ) : (
                    <Input
                        id="titre"
                        name="titre"
                        value={formData.titre}
                        onChange={handleTitleChange}
                        className="bg-blue-950/50 border-blue-900/30 text-white"
                        required
                    />
                )}

                {/* Suggestions (affichées en mode édition uniquement) */}
                {!readOnly && isLoadingSuggestions && (
                    <div className="absolute z-10 w-full mt-1 bg-blue-950 border border-blue-900/30 rounded-md p-2">
                        Chargement...
                    </div>
                )}
                {!readOnly && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-blue-950 border border-blue-900/30 rounded-md max-h-80 overflow-y-auto">
                        {suggestions.slice(0, 5).map((suggestion) => (
                            <div
                                key={suggestion.id}
                                className="p-2 hover:bg-blue-900/50 cursor-pointer flex items-start space-x-2 border-b border-blue-900/30"
                                onClick={() => handleSuggestionSelect(suggestion)}
                            >
                                {suggestion.posterPath && (
                                    <img
                                        src={
                                            formData.type === 'manga'
                                                ? suggestion.posterPath
                                                : `https://image.tmdb.org/t/p/w92${suggestion.posterPath}`
                                        }
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
            </div>
            {formData.type === 'manga' && (
                <div>
                    {/* Nombre de chapitres (pour manga) */}
                    <div>
                        <Label htmlFor="chapters_count">Nombre de chapitres</Label>
                        {readOnly ? (
                            <div className="text-white">{formData.chapters_count}</div>
                        ) : (
                            <Input
                                id="chapters_count"
                                name="chapters_count"
                                type="number"
                                value={formData.chapters_count || 0}
                                onChange={(e) => handleChange('chapters_count', e.target.value)}
                                className="bg-blue-950/50 border-blue-900/30 text-white"
                            />
                        )}
                    </div>

                    {/* Nombre de volumes (pour manga) */}
                    <div>
                        <Label htmlFor="volumes_count">Nombre de volumes</Label>
                        {readOnly ? (
                            <div className="text-white">{formData.volumes_count}</div>
                        ) : (
                            <Input
                                id="volumes_count"
                                name="volumes_count"
                                type="number"
                                value={formData.volumes_count || 0}
                                onChange={(e) => handleChange('volumes_count', e.target.value)}
                                className="bg-blue-950/50 border-blue-900/30 text-white"
                            />
                        )}
                    </div>
                </div>
            )}
            {/* Description */}
            <div>
                <Label htmlFor="description">Description</Label>
                {readOnly ? (
                    <div className="text-white whitespace-pre-wrap">{formData.description}</div>
                ) : (
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full p-2 bg-blue-950/50 border-blue-900/30 text-white rounded"
                        rows={5}
                    />
                )}
            </div>

            {/* URL de l'image */}
            <div>
                <Label htmlFor="image_url">URL de l'image</Label>
                {readOnly ? (
                    <div className="text-white">{formData.image_url}</div>
                ) : (
                    <Input
                        id="image_url"
                        name="image_url"
                        value={formData.image_url || ''}
                        onChange={(e) => handleChange('image_url', e.target.value)}
                        className="bg-blue-950/50 border-blue-900/30 text-white"
                    />
                )}
            </div>

            {/* Date de sortie */}
            <div>
                <Label htmlFor="release_date">Date de sortie</Label>
                {readOnly ? (
                    <div className="text-white">{formData.release_date}</div>
                ) : (
                    <Input
                        id="release_date"
                        name="release_date"
                        type="date"
                        value={formData.release_date || ''}
                        onChange={(e) => handleChange('release_date', e.target.value)}
                        className="bg-blue-950/50 border-blue-900/30 text-white"
                    />
                )}
            </div>

            {/* Genre */}
            <div>
                <Label htmlFor="genre">Genre</Label>
                {readOnly ? (
                    <div className="text-white">{formData.genre}</div>
                ) : (
                    <Input
                        id="genre"
                        name="genre"
                        value={formData.genre || ''}
                        onChange={(e) => handleChange('genre', e.target.value)}
                        className="bg-blue-950/50 border-blue-900/30 text-white"
                    />
                )}
            </div>

            {/* Note (Rating) */}
            <div>
                <Label htmlFor="rating">Note</Label>
                {readOnly ? (
                    <div className="text-white">{formData.rating}</div>
                ) : (
                    <Input
                        id="rating"
                        name="rating"
                        type="number"
                        step="0.1"
                        value={formData.rating || ''}
                        onChange={(e) => handleChange('rating', e.target.value)}
                        className="bg-blue-950/50 border-blue-900/30 text-white"
                    />

                )}
            </div>

            {/* TMDB ID */}
            <div>
                <Label htmlFor="tmdb_id">TMDB ID</Label>
                {readOnly ? (
                    <div className="text-white">{formData.tmdb_id}</div>
                ) : (
                    <Input
                        id="tmdb_id"
                        name="tmdb_id"
                        value={formData.tmdb_id || ''}
                        onChange={(e) => handleChange('tmdb_id', e.target.value)}
                        className="bg-blue-950/50 border-blue-900/30 text-white"
                    />
                )}
            </div>


            {/* Saisons possédées (pour série) */}
            {formData.type === 'serie' && (
                <div>
                    <Label htmlFor="saisons_possedees">Saisons possédées</Label>
                    {readOnly ? (
                        <div className="text-white">{formData.saisons_possedees}</div>
                    ) : (
                        <Input
                            id="saisons_possedees"
                            name="saisons_possedees"
                            type="number"
                            min="0"
                            value={formData.saisons_possedees}
                            onChange={(e) => handleChange('saisons_possedees', e.target.value)}
                            className="bg-blue-950/50 border-blue-900/30 text-white"
                        />
                    )}
                </div>
            )}

            {/* Langue */}
            <div>
                <Label htmlFor="language">Langue</Label>
                {readOnly ? (
                    <div className="text-white">{formData.language}</div>
                ) : (
                    <Input
                        id="language"
                        name="language"
                        value={formData.language || ''}
                        onChange={(e) => handleChange('language', e.target.value)}
                        className="bg-blue-950/50 border-blue-900/30 text-white"
                    />
                )}
            </div>

            {/* Pays de production */}
            <div>
                <Label htmlFor="production_country">Pays de production</Label>
                {readOnly ? (
                    <div className="text-white">{formData.production_country}</div>
                ) : (
                    <Input
                        id="production_country"
                        name="production_country"
                        value={formData.production_country || ''}
                        onChange={(e) => handleChange('production_country', e.target.value)}
                        className="bg-blue-950/50 border-blue-900/30 text-white"
                    />
                )}
            </div>

            {/* Champs système en lecture seule */}
            {formData.createdAt && (
                <div>
                    <Label>Créé le</Label>
                    <div className="text-white">{new Date(formData.createdAt).toLocaleString()}</div>
                </div>
            )}

            {formData.updatedAt && (
                <div>
                    <Label>Mis à jour le</Label>
                    <div className="text-white">{new Date(formData.updatedAt).toLocaleString()}</div>
                </div>
            )}

            {formData.added_date && (
                <div>
                    <Label>Date d'ajout</Label>
                    <div className="text-white">{new Date(formData.added_date).toLocaleString()}</div>
                </div>
            )}

            {/* Boutons uniquement en mode édition */}
            {!readOnly && (
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Annuler
                    </Button>
                    <Button type="submit" className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                        {initialData.id ? 'Mettre à jour' : 'Ajouter'}
                    </Button>
                </div>
            )}
        </form>
        </div>
    );
}
