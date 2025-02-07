const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data: {
        type: DataTypes.JSON
    },
    statut: {
        type: DataTypes.ENUM('en_attente', 'confirme', 'livre'),
        defaultValue: 'en_attente'
    }
});

module.exports = Order;