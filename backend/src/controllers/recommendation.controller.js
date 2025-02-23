const { Content, Like } = require('../models');
const { Op } = require("sequelize");
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Fonction pour normaliser le texte
const normalizeText = (text) => {
    if (!text) return '';
    return text.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();
};

// Fonction pour extraire les mots-clés
const extractKeywords = (text) => {
    if (!text) return [];
    const normalized = normalizeText(text);
    const tokens = tokenizer.tokenize(normalized);
    return tokens.filter(token => token.length > 2);
};

// Fonction pour calculer la similarité entre deux ensembles de mots-clés
const calculateKeywordSimilarity = (keywords1, keywords2) => {
    if (!keywords1.length || !keywords2.length) return 0;
    const set1 = new Set(keywords1);
    const set2 = new Set(keywords2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    return (2.0 * intersection.size) / (set1.size + set2.size);
};

// Fonction principale pour calculer le score de similarité
const calculateSimilarityScore = (content, userPreferences) => {
    let score = 0;

    // Similarité de description (70%)
    const descriptionSimilarity = calculateKeywordSimilarity(
        extractKeywords(content.description),
        userPreferences.descriptionKeywords
    );
    score += descriptionSimilarity * 70;

    // Similarité de genre (20%)
    if (userPreferences.genres.includes(content.genre)) {
        score += 20;
    }

    // Similarité de titre (10%)
    const titleSimilarity = calculateKeywordSimilarity(
        extractKeywords(content.titre),
        userPreferences.titleKeywords
    );
    score += titleSimilarity * 10;

    return Math.min(100, score);
};

exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Recherche des recommandations pour userId:', userId);

        // Récupérer les likes de l'utilisateur
        const userLikes = await Like.findAll({
            where: { user_id: userId },
            include: [{ model: Content }]
        });

        // Si pas de likes, retourner un tableau vide
        if (userLikes.length === 0) {
            console.log('Aucun like trouvé, retour tableau vide');
            return res.json([]);
        }

        // Collecter les préférences de l'utilisateur
        const userPreferences = {
            descriptionKeywords: new Set(),
            titleKeywords: new Set(),
            genres: new Set()
        };

        // Analyser tous les contenus likés
        userLikes.forEach(like => {
            if (like.Content) {
                // Collecter les mots-clés des descriptions
                extractKeywords(like.Content.description)
                    .forEach(k => userPreferences.descriptionKeywords.add(k));

                // Collecter les mots-clés des titres
                extractKeywords(like.Content.titre)
                    .forEach(k => userPreferences.titleKeywords.add(k));

                // Collecter les genres
                if (like.Content.genre) {
                    userPreferences.genres.add(like.Content.genre);
                }
            }
        });

        // Convertir les Sets en Arrays pour le calcul
        const preferences = {
            descriptionKeywords: Array.from(userPreferences.descriptionKeywords),
            titleKeywords: Array.from(userPreferences.titleKeywords),
            genres: Array.from(userPreferences.genres)
        };

        console.log('Préférences analysées:', {
            descriptionKeywordsCount: preferences.descriptionKeywords.length,
            titleKeywordsCount: preferences.titleKeywords.length,
            genres: preferences.genres
        });

        // Récupérer les contenus non likés
        const contents = await Content.findAll({
            where: {
                id: { [Op.notIn]: userLikes.map(like => like.content_id) }
            }
        });

        console.log('Nombre de contenus à analyser:', contents.length);

        // Calculer les scores pour chaque contenu
        const scoredContents = contents
            .map(content => ({
                ...content.toJSON(),
                score: calculateSimilarityScore(content, preferences)
            }))
            .filter(content => content.score > 0) // Ne garder que les contenus avec un score positif
            .sort((a, b) => b.score - a.score);

        console.log(`Nombre de recommandations trouvées: ${scoredContents.length}`);

        // Retourner les 20 meilleures recommandations
        const recommendations = scoredContents.slice(0, 20);
        res.json(recommendations);

    } catch (error) {
        console.error('Erreur dans les recommandations:', error);
        res.status(500).json({
            message: 'Erreur lors du calcul des recommandations',
            error: error.message
        });
    }
};