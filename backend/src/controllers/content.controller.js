const { Content, Like, User} = require('../models');
const path = require('path');
const fs = require('fs');
const { processImage } = require('../config/multer');
const {Op, Sequelize} = require("sequelize");


const getAllContent = async (req, res) => {
    try {
        const {
            search, type, startDate, endDate,
            status, rating, language,
            page = 1,
            limit = 10
        } = req.query;

        // Construction dynamique des conditions
        let whereConditions = {};

        if (search) {
            whereConditions[Op.or] = [
                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('titre')), 'LIKE', `%${search.toLowerCase()}%`),
                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('description')), 'LIKE', `%${search.toLowerCase()}%`),
                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('genre')), 'LIKE', `%${search.toLowerCase()}%`)
            ];
        }

        // Après la modification
        if (type && type !== 'all' && type !== 'null') {
            whereConditions.type = type;
        }

        if (status) whereConditions.status = status;
        if (rating) whereConditions.rating = rating;
        if (language) whereConditions.language = language;

        if (startDate && endDate) {
            whereConditions.release_date = {
                [Op.between]: [startDate, endDate]
            };
        } else if (startDate) {
            whereConditions.release_date = {
                [Op.gte]: startDate
            };
        } else if (endDate) {
            whereConditions.release_date = {
                [Op.lte]: endDate
            };
        }

        const offset = (page - 1) * limit;

        const { count, rows: content } = await Content.findAndCountAll({
            where: whereConditions,
            order: [['release_date', 'DESC']],
            limit: Number(limit),
            offset: Number(offset),
            include: [{
                model: Like,
                include: [{
                    model: User,
                    attributes: ['nom', 'prenom']
                }]
            }]
        });

        res.json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            contents: content
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération du contenu',
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