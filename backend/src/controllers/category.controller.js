const { Category } = require('../models');
const {Op} = require("sequelize");

const getAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';

        // Construire la condition de recherche
        const whereCondition = search.length >= 3 ? {
            nom: {
                [Op.like]: `%${search}%`  // Utilisation de Op.like au lieu de Op.iLike
            }
        } : {};

        // Récupérer les catégories avec pagination et le compte total
        const { count, rows: categories } = await Category.findAndCountAll({
            where: whereCondition,
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        // Calculer les métadonnées de pagination
        const totalPages = Math.ceil(count / limit); // count est un nombre, pas un tableau

        // Formater la réponse
        res.json({
            categories,
            pagination: {
                totalItems: count,
                totalPages,
                currentPage: page,
                limit
            }
        });

    } catch (error) {
        console.error('Error in getAllCategories:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des catégories',
            error: error.message
        });
    }
};
const createCategory = async (req, res) => {
    try {
        const { nom } = req.body;

        const category = await Category.create({ nom });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la création de la catégorie',
            error: error.message
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom } = req.body;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        await category.update({ nom });

        res.json(category);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de la catégorie',
            error: error.message
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        await category.destroy();
        res.json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la suppression de la catégorie',
            error: error.message
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération de la catégorie',
            error: error.message
        });
    }
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
};