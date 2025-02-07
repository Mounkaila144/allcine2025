const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Loyalty = sequelize.define('Loyalty', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stamp_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    card_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = Loyalty;