const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        index: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isConfirme: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    role: {
        type: DataTypes.ENUM('client', 'admin'),
        defaultValue: 'client'
    },
    otpCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    otpExpiration: {
        type: DataTypes.DATE,
        allowNull: true
    },
    otpAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    maxOtpAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    },
    lastResetRequest: {
        type: DataTypes.DATE,
        allowNull: true
    },
    resetRequestCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    registrationAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastRegistrationAttempt: {
        type: DataTypes.DATE,
        allowNull: true
    }

});

module.exports = User;