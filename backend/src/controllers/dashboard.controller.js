const { User, Content, Article, Order, Like, Loyalty,Category } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const getDashboardStats = async (req, res) => {
    try {
        // Stats utilisateurs
        const users = await User.count();

        // Stats commandes
        const orders = await Order.count();

        // Stats fidélité
        //const loyaltyStamps = await Loyalty.sum('points');

        // Stats contenus par type
        const contentStats = await Content.findAll({
            attributes: [
                'type',
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['type']
        });

        // Transformer les stats de contenu en objet
        const contentCounts = {
            totalFilms: contentStats.find(stat => stat.type === 'film')?.dataValues.count || 0,
            totalSeries: contentStats.find(stat => stat.type === 'serie')?.dataValues.count || 0,
            totalMangas: contentStats.find(stat => stat.type === 'manga')?.dataValues.count || 0
        };

        // Nombre d'articles tech
        const techProducts = await Article.count({
            include: [{
                model: Category,
                where: {
                    nom: {
                        [Op.like]: '%tech%'
                    }
                }
            }]
        });

        // Stats d'activité des utilisateurs sur les 6 derniers mois
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const userActivity = await Like.findAll({
            attributes: [
                [fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), 'date'],
                [fn('COUNT', col('id')), 'activity']
            ],
            where: {
                createdAt: {
                    [Op.gte]: sixMonthsAgo
                }
            },
            group: [fn('DATE_FORMAT', col('createdAt'), '%Y-%m')],
            order: [[col('date'), 'ASC']],
            raw: true
        });

        // Comptage des interactions (likes + lectures)
        const articleReads = await Like.count();

        // Assemblage de toutes les statistiques
        const stats = {
            users,
            orders,
            //loyaltyStamps,
            ...contentCounts,
            totalTechProducts: techProducts,
            articleReads,
            userActivity: userActivity.map(activity => ({
                date: new Date(activity.date + '-01').toLocaleString('default', { month: 'short' }),
                activity: parseInt(activity.activity)
            }))
        };

        res.json(stats);
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des statistiques du dashboard',
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats
};