const { User, Loyalty, Reservation, Order } = require('../models');
const bcrypt = require('bcryptjs');
const { BCRYPT_ROUNDS } = require('../config/config');

const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Loyalty,
                    attributes: ['stamp_count', 'card_count']
                },
                {
                    model: Order,
                    order: [['createdAt', 'DESC']],
                    limit: 5
                }
            ]
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération du profil',
            error: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { phone, prenom, nom, role } = req.body;
        const user = await User.findByPk(req.user.id);

        await user.update({ phone, prenom, nom, role });

        // Exclude password from response
        const updatedUser = user.toJSON();
        delete updatedUser.password;

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du profil',
            error: error.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        // Vérifier l'ancien mot de passe
        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Ancien mot de passe incorrect' });
        }

        // Hash du nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

        await user.update({ password: hashedPassword });

        res.json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors du changement de mot de passe',
            error: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des utilisateurs',
            error: error.message
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getAllUsers,
    changePassword
};