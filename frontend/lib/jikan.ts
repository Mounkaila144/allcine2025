// lib/jikan.ts
export async function fetchMangaData(titre: string): Promise<any[] | null> {
    console.log('Début fetchMangaData avec:', { titre });

    // Nous allons faire deux appels : un pour la recherche et un pour les détails en français
    const searchUrl = `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(titre)}&limit=10&sfw=true`;
    console.log('URL de recherche Jikan:', searchUrl);

    try {
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        console.log('Réponse de recherche Jikan:', searchData);

        if (searchData.data && searchData.data.length > 0) {
            // Pour chaque manga trouvé, nous allons chercher ses détails en français
            const detailedResults = await Promise.all(
                searchData.data.map(async (manga: any) => {
                    // Attendre 1 seconde entre chaque requête pour respecter la limite de rate de l'API
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const detailUrl = `https://api.jikan.moe/v4/manga/${manga.mal_id}/full`;
                    try {
                        const detailRes = await fetch(detailUrl);
                        const detailData = await detailRes.json();
                        const mangaDetail = detailData.data;

                        // Rechercher les titres alternatifs en français
                        const frenchTitle = mangaDetail.titles.find(
                            (title: any) => title.type === 'French'
                        )?.title || mangaDetail.title;

                        return {
                            id: mangaDetail.mal_id,
                            title: frenchTitle,
                            original_title: mangaDetail.title,
                            overview: mangaDetail.synopsis,
                            poster_path: mangaDetail.images.jpg.large_image_url,
                            release_date: mangaDetail.published.from ? mangaDetail.published.from.split('T')[0] : null,
                            genres: mangaDetail.genres.map((g: any) => g.name),
                            status: convertMangaStatus(mangaDetail.status),
                            chapters: mangaDetail.chapters,
                            volumes: mangaDetail.volumes,
                            score: mangaDetail.score,
                            popularity: mangaDetail.popularity,
                            authors: mangaDetail.authors.map((a: any) => a.name).join(', ')
                        };
                    } catch (error) {
                        console.error(`Erreur lors de la récupération des détails pour le manga ${manga.mal_id}:`, error);
                        return null;
                    }
                })
            );

            // Filtrer les résultats nuls et retourner les données
            return detailedResults.filter(result => result !== null);
        }
        console.log('Aucun résultat trouvé');
        return null;
    } catch (error) {
        console.error("Erreur lors de la récupération depuis Jikan:", error);
        return null;
    }
}

function convertMangaStatus(jikanStatus: string): 'released' | 'upcoming' | 'cancelled' {
    switch (jikanStatus) {
        case 'Finished':
        case 'Complete':
            return 'released';
        case 'Publishing':
        case 'On Hiatus':
            return 'upcoming';
        case 'Discontinued':
            return 'cancelled';
        default:
            return 'released';
    }
}
