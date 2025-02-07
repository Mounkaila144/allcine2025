const { Loyalty, User } = require('../models');

const getLoyaltyStatus = async (req, res) => {
    try {
        const loyalty = await Loyalty.findOne({
            where: { user_id: req.user.id }
        });

        if (!loyalty) {
            // Créer une nouvelle entrée de fidélité si elle n'existe pas
            const newLoyalty = await Loyalty.create({
                user_id: req.user.id,
                stamp_count: 0,
                card_count: 0
            });

            return res.json(newLoyalty);
        }

        res.json(loyalty);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération du statut de fidélité',
            error: error.message
        });
    }
};

const updateLoyaltyStamps = async (req, res) => {
    try {
        const { stamp_count, card_count } = req.body;

        const loyalty = await Loyalty.findOne({
            where: { user_id: req.user.id }
        });

        if (!loyalty) {
            return res.status(404).json({ message: 'Aucun programme de fidélité trouvé' });
        }

        await loyalty.update({
            stamp_count: stamp_count || loyalty.stamp_count,
            card_count: card_count || loyalty.card_count
        });

        res.json(loyalty);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour des tampons de fidélité',
            error: error.message
        });
    }
};

const resetLoyaltyStamps = async (req, res) => {
    try {
        const loyalty = await Loyalty.findOne({
            where: { user_id: req.user.id }
        });

        if (!loyalty) {
            return res.status(404).json({ message: 'Aucun programme de fidélité trouvé' });
        }

        await loyalty.update({
            stamp_count: 0,
            card_count: 0
        });

        res.json(loyalty);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la réinitialisation des tampons de fidélité',
            error: error.message
        });
    }
};
const createLoyaltyStatus = async (req, res) => {
    try {
        const { user_id } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier si l'utilisateur a déjà une carte de fidélité
        const existingLoyalty = await Loyalty.findOne({ where: { user_id } });
        if (existingLoyalty) {
            return res.status(400).json({ message: 'Cet utilisateur a déjà une carte de fidélité' });
        }

        // Créer une nouvelle carte de fidélité
        const newLoyalty = await Loyalty.create({
            user_id,
            stamp_count: 0,
            card_count: 0
        });

        res.status(201).json(newLoyalty);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la création du statut de fidélité',
            error: error.message
        });
    }
};
module.exports = {
    getLoyaltyStatus,
    updateLoyaltyStamps,
    resetLoyaltyStamps,
    createLoyaltyStatus
};