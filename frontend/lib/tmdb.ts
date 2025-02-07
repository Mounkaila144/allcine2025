export async function fetchTMDBData(titre: string, type: 'film' | 'serie'): Promise<any[] | null> {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) {
        console.error("Clé API TMDB non définie");
        return null;
    }

    const endpoint = type === 'film' ? 'movie' : 'tv';
    const url = `https://api.themoviedb.org/3/search/${endpoint}?api_key=${apiKey}&query=${encodeURIComponent(titre)}&language=fr`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            return data.results.map((item: any) => ({
                id: item.id,
                // Pour les films, TMDB retourne "title" et "original_title",
                // pour les séries, "name" et "original_name"
                title: item.title || item.name,
                original_title: item.original_title || item.original_name || (item.title || item.name),
                releaseDate: item.release_date || item.first_air_date,
                // Pour l'affichage dans la suggestion, on peut conserver le chemin brut et ajouter le préfixe lors de la sélection
                posterPath: item.poster_path ? item.poster_path : null,
                overview: item.overview,
                score: item.vote_average,
            }));
        }
        return null;
    } catch (error) {
        console.error("Erreur lors de la récupération depuis TMDB:", error);
        return null;
    }
}
