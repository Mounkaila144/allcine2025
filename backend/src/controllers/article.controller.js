const { Article, Category } = require('../models');
const path = require('path');
const fs = require('fs');
const { processImage } = require('../config/multer');
const uploadsDir = path.join(__dirname, '../../uploads');

// controllers/articleController.js
const getAllArticles = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        // Construction des filtres
        const whereClause = {};

        // Recherche insensible à la casse sur le titre
        if (req.query.search) {
            whereClause.titre = Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('titre')),
                'LIKE',
                `%${req.query.search.toLowerCase()}%`
            );
        }

        // Filtre par catégorie
        if (req.query.categorie_id && req.query.categorie_id !== 'all') {
            whereClause.categorie_id = parseInt(req.query.categorie_id, 10);
        }

        // Filtre de prix
        if (req.query.minPrice || req.query.maxPrice) {
            whereClause.prix = {};
            if (req.query.minPrice) {
                whereClause.prix[Op.gte] = parseFloat(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                whereClause.prix[Op.lte] = parseFloat(req.query.maxPrice);
            }
        }

        // Gestion du tri
        const order = [];
        if (req.query.sortBy && ['titre', 'prix', 'createdAt'].includes(req.query.sortBy)) {
            order.push([req.query.sortBy, req.query.sortOrder?.toUpperCase() || 'ASC']);
        } else {
            order.push(['createdAt', 'DESC']);
        }

        const { count, rows: articles } = await Article.findAndCountAll({
            where: whereClause,
            include: [{
                model: Category,
                attributes: ['nom'],
                required: false
            }],
            order,
            limit,
            offset
        });

        const totalPages = Math.ceil(count / limit);
        const currentPage = page > totalPages ? totalPages : page;

        res.json({
            articles,
            pagination: {
                totalItems: count,
                totalPages,
                currentPage,
                limit,
                hasNextPage: currentPage < totalPages,
                hasPreviousPage: currentPage > 1
            }
        });
    } catch (error) {
        console.error('Error in getAllArticles:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des articles',
            error: error.message
        });
    }
};
// ... rest of your controller ...
const createArticle = async (req, res) => {
    try {
        const { titre, categorie_id, prix, description } = req.body;

        let imageUrl = null;
        if (req.file) {
            const filename = await processImage(req.file);
            imageUrl = `/uploads/${filename}`;
        }

        const article = await Article.create({
            titre,
            categorie_id,
            prix,
            description,
            image: imageUrl
        });

        // Charger l'article avec sa catégorie
        const articleWithCategory = await Article.findByPk(article.id, {
            include: [{ model: Category, attributes: ['nom'] }]
        });

        res.status(201).json(articleWithCategory);
    } catch (error) {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            message: 'Erreur lors de la création de l\'article',
            error: error.message
        });
    }
};

const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { titre, categorie_id, prix, description } = req.body;

        const article = await Article.findByPk(id);

        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }

        let imageUrl = article.image;

        if (req.file) {
            if (article.image) {
                const oldFilePath = path.join(uploadsDir, article.image.split('/').pop());
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            const filename = await processImage(req.file);
            imageUrl = `/uploads/${filename}`;
        }

        await article.update({
            titre,
            categorie_id,
            prix,
            description,
            image: imageUrl
        });

        // Recharger l'article avec sa catégorie
        const updatedArticle = await Article.findByPk(id, {
            include: [{ model: Category, attributes: ['nom'] }]
        });

        res.json(updatedArticle);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de l\'article',
            error: error.message
        });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;

        const article = await Article.findByPk(id);

        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }

        // Supprimer l'image associée
        if (article.image) {
            const filename = article.image.split('/').pop();
            const absolutePath = path.join(uploadsDir, filename);

            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        }

        await article.destroy();
        res.json({ message: 'Article supprimé avec succès' });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la suppression de l\'article',
            error: error.message
        });
    }
};

const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;

        const article = await Article.findByPk(id, {
            include: [{ model: Category, attributes: ['nom'] }]
        });

        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }

        res.json(article);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération de l\'article',
            error: error.message
        });
    }
};

module.exports = {
    getAllArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    getArticleById
};