const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306, // Utilisation du port depuis l'env, sinon 3306 par défaut
        dialect: 'mysql',
        logging: true
    },
);

module.exports = sequelize;
