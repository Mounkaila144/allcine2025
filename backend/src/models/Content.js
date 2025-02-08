const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Content = sequelize.define('Content', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('film', 'serie', 'manga'),
        allowNull: false
    },
    saisons_possedees: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tmdb_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true // Added unique constraint

    },
    genre: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    release_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    added_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('released', 'upcoming', 'cancelled'),
        defaultValue: 'released'
    },
    rating: {
        type: DataTypes.DECIMAL(3, 1), // <-- Définition de la colonne rating
        allowNull: true,
        validate: {
            min: 0,
            max: 10
        }
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    episodes_count: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    original_title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    language: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'fr'
    },
    production_country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    average_rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0,
            max: 10
        }
    }
});

module.exports = Content;