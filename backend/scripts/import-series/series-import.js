// scripts/import-series/series-import.js
const fs = require('fs');
const axios = require('axios');
const { Content } = require('../../src/models');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const cleanTitle = (title) => {
    return title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .trim();
};

// Mapping des genres TMDB
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

// Fonction pour convertir les IDs de genre en noms
const convertGenreIdsToNames = (genreIds) => {
    if (!genreIds || !Array.isArray(genreIds)) return '';

    const genreNames = genreIds
        .map(id => genreMapping[id])
        .filter(name => name); // Filtrer les undefined

    return genreNames.join(', ');
};

async function fetchTMDBData(titre, apiKey) {
    const cleanedTitle = cleanTitle(titre);
    const url = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(cleanedTitle)}&language=fr`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.results && data.results.length > 0) {
            const item = data.results[0];

            // Convertir les IDs de genre en noms
            const genreNames = convertGenreIdsToNames(item.genre_ids);

            return {
                tmdb_id: item.id.toString(),
                titre: item.name,
                original_title: item.original_name || item.name,
                description: item.overview,
                image_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
                release_date: item.first_air_date || new Date().toISOString().split('T')[0],
                rating: item.vote_average,
                genre: genreNames, // Utiliser les noms des genres au lieu des IDs
                language: item.original_language || 'fr',
                production_country: item.origin_country?.[0] || null,
                episodes_count: item.number_of_episodes || null
            };
        }
        return null;
    } catch (error) {
        console.error(`Erreur TMDB pour ${titre}:`, error.message);
        return null;
    }
}
async function importSeries(inputFile, apiKey) {
    if (!fs.existsSync(inputFile)) {
        throw new Error(`Le fichier ${inputFile} n'existe pas`);
    }

    // Lecture du fichier d'entrée
    const series = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    const results = {
        success: 0,
        failed: 0,
        errors: [],
        imported: []
    };


    for (let [index, serie] of series.entries()) {
        try {

            // Vérification si la série existe déjà
            const existingSerie = await Content.findOne({
                where: {
                    titre: serie.titre,
                    type: 'serie'
                }
            });

            if (existingSerie) {
                await existingSerie.update({
                    saisons_possedees: serie.saisons // Utilisation de "saisons" au lieu de "saisons_possedees"
                });
                results.success++;
                results.imported.push(`${serie.titre} (mis à jour)`);
                continue;
            }

            // Récupération des données depuis TMDB
            const tmdbData = await fetchTMDBData(serie.titre, apiKey);

            if (!tmdbData) {
                results.failed++;
                results.errors.push(`Pas de données TMDB: ${serie.titre}`);
                continue;
            }

            // Création de l'entrée dans la base de données
            const newSerie = await Content.create({
                ...tmdbData,
                type: 'serie',
                saisons_possedees: serie.saisons, // Utilisation de "saisons" au lieu de "saisons_possedees"
                status: 'released',
                added_date: new Date().toISOString().split('T')[0]
            });

            results.success++;
            results.imported.push(serie.titre);

            // Attente entre chaque requête
            await delay(1000);

        } catch (error) {
            results.failed++;
            results.errors.push(`${serie.titre}: ${error.message}`);
        }
    }

    // Génération du rapport
    const rapport = {
        date: new Date().toISOString(),
        total: series.length,
        ...results
    };

    const reportFile = `import-report-${Date.now()}.json`;
    fs.writeFileSync(
        reportFile,
        JSON.stringify(rapport, null, 2)
    );


    return rapport;
}

module.exports = { importSeries };