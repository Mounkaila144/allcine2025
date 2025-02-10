const { Content, Like, User} = require('../models');
const path = require('path');
const fs = require('fs');
const {Op, Sequelize} = require("sequelize");

const getAllContent = async (req, res) => {
    try {
        // Extract query parameters
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';
        const type = req.query.type || null;
        const genre = req.query.genre || null;

        // Build the where condition
        const whereCondition = {};

        // Add search condition if search term is 3 or more characters
        if (search.length >= 3) {
            whereCondition.titre = {
                [Op.like]: `%${search}%`
            };
        }

        // Add type filter if specified and not 'all'
        if (type && type !== 'all') {
            whereCondition.type = type;
        }

        // Add genre filter if specified and not 'all'
        if (genre && genre !== 'all') {
            whereCondition.genre = genre;
        }

        // Get contents with pagination and total count
        const { count, rows: contents } = await Content.findAndCountAll({
            where: whereCondition,
            order: [['titre', 'ASC']],
            limit,
            offset
        });

        // Calculate pagination metadata
        const totalPages = Math.ceil(count / limit);

        // Format the response
        res.json({
            contents,
            totalItems: count,
            totalPages,
            currentPage: page,
            limit
        });

    } catch (error) {
        console.error('Error in getAllContents:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des contenus',
            error: error.message
        });
    }
};

const createContent = async (req, res) => {
    try {
        const {
            titre,
            type,
            saisons_possedees,
            tmdb_id,
            genre,
            description,
            image_url,
            release_date,
            status,
            rating,
            duration_minutes,
            episodes_count,
            original_title,
            language,
            production_country,
            average_rating
        } = req.body;

        const content = await Content.create({
            titre,
            type,
            saisons_possedees: saisons_possedees || 0,
            tmdb_id,
            genre,
            description,
            image_url,
            release_date,
            status: status || 'released',
            rating,
            duration_minutes,
            episodes_count,
            original_title,
            language: language || 'fr',
            production_country,
            average_rating
        });

        res.status(201).json(content);
    } catch (error) {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            message: 'Erreur lors de la création du contenu',
            error: error.message
        });
    }
};

const updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            titre,
            type,
            saisons_possedees,
            tmdb_id,
            genre,
            description,
            image_url,
            release_date,
            status,
            rating,
            duration_minutes,
            episodes_count,
            original_title,
            language,
            production_country,
            average_rating
        } = req.body;

        const content = await Content.findByPk(id);

        if (!content) {
            return res.status(404).json({ message: 'Contenu non trouvé' });
        }

        await content.update({
            titre,
            type,
            saisons_possedees: saisons_possedees || content.saisons_possedees,
            tmdb_id,
            genre,
            description,
            image_url,
            release_date,
            status,
            rating,
            duration_minutes,
            episodes_count,
            original_title,
            language,
            production_country,
            average_rating
        });

        res.json(content);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du contenu',
            error: error.message
        });
    }
};
const deleteContent = async (req, res) => {
    try {
        const { id } = req.params;

        const content = await Content.findByPk(id);

        if (!content) {
            return res.status(404).json({ message: 'Contenu non trouvé' });
        }

        // Supprimer l'image associée
        if (content.image_url) {
            const filename = content.image_url.split('/').pop();
            const absolutePath = path.join(uploadsDir, filename);

            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        }

        // Supprimer les likes associés
        await Like.destroy({
            where: { content_id: id }
        });

        await content.destroy();
        res.json({ message: 'Contenu supprimé avec succès' });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la suppression du contenu',
            error: error.message
        });
    }
};

const getContentById = async (req, res) => {
    try {
        const { id } = req.params;

        const content = await Content.findByPk(id, {
            include: [{
                model: Like,
                include: [{ model: User, attributes: ['nom', 'prenom'] }]
            }]
        });

        if (!content) {
            return res.status(404).json({ message: 'Contenu non trouvé' });
        }

        res.json(content);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération du contenu',
            error: error.message
        });
    }
};

module.exports = {
    getAllContent,
    createContent,
    updateContent,
    deleteContent,
    getContentById
};