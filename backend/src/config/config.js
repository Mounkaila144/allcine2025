require('dotenv').config();

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRES_IN: '24h',
    BCRYPT_ROUNDS: 10
};