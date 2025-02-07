const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Article = sequelize.define('Article', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categorie_id: {  // Ajout de la clé étrangère
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categories',
            key: 'id'
        }
    },
    prix: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    description: {
        type: DataTypes.TEXT
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Article;