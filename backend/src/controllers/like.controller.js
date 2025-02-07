const { Like, User, Content } = require('../models');

const toggleLike = async (req, res) => {
    try {
        const { content_id } = req.body;
        const user_id = req.user.id;

        // Vérifier si le contenu existe
        const content = await Content.findByPk(content_id);
        if (!content) {
            return res.status(404).json({ message: 'Contenu non trouvé' });
        }

        // Rechercher un like existant
        const existingLike = await Like.findOne({
            where: { user_id, content_id }
        });

        if (existingLike) {
            // Si le like existe déjà, le supprimer (unlike)
            await existingLike.destroy();
            return res.json({ message: 'Like retiré', liked: false });
        } else {
            // Créer un nouveau like
            await Like.create({ user_id, content_id });
            return res.json({ message: 'Like ajouté', liked: true });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la gestion du like',
            error: error.message
        });
    }
};

const getUserLikes = async (req, res) => {
    try {
        const likes = await Like.findAll({
            where: { user_id: req.user.id },
            include: [{
                model: Content,
                attributes: ['id', 'titre', 'type', 'description', 'image_url']
            }]
        });

        res.json(likes);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des likes',
            error: error.message
        });
    }
};

const getLikesCount = async (req, res) => {
    try {
        const { content_id } = req.params;

        // Vérifier si le contenu existe
        const content = await Content.findByPk(content_id);
        if (!content) {
            return res.status(404).json({ message: 'Contenu non trouvé' });
        }

        const likesCount = await Like.count({
            where: { content_id }
        });

        res.json({
            content_id,
            likes_count: likesCount,
            is_liked: await Like.findOne({
                where: {
                    user_id: req.user.id,
                    content_id
                }
            }) !== null
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération du nombre de likes',
            error: error.message
        });
    }
};

module.exports = {
    toggleLike,
    getUserLikes,
    getLikesCount
};