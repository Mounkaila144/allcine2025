// order.controller.js
const { Order, User } = require('../models');

const createOrder = async (req, res) => {
    try {
        const { data } = req.body;
        const user_id = req.user.id;

        if (!data) {
            return res.status(400).json({ message: 'Les données de la commande sont requises' });
        }

        const order = await Order.create({
            user_id,
            data,
            statut: 'en_attente'
        });

        res.status(201).json(order);
    } catch (error) {
        console.error('Erreur de création de commande:', error);
        res.status(500).json({
            message: 'Erreur lors de la création de la commande',
            error: error.message
        });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user.id },
            include: [{
                model: User,
                attributes: ['id', 'nom', 'prenom', 'phone']
            }],
            order: [['id', 'DESC']]
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des commandes',
            error: error.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

        if (!['en_attente', 'confirme', 'livre'].includes(statut)) {
            return res.status(400).json({ message: 'Statut invalide' });
        }

        const order = await Order.findByPk(id, {
            include: [{
                model: User,
                attributes: ['id', 'nom', 'prenom', 'phone']
            }]
        });

        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        await order.update({ statut });
        console.log(order)
        res.json(order);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du statut de la commande',
            error: error.message
        });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        await order.destroy();

        res.json({ message: 'Commande supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la commande:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression de la commande',
            error: error.message
        });
    }
};


module.exports = {
    createOrder,
    getUserOrders,
    updateOrderStatus,
    deleteOrder
};