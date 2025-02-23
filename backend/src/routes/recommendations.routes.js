// src/routes/recommendation.routes.js

const router = require('express').Router();
const {
    getRecommendations
} = require('../controllers/recommendation.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.get('/', authMiddleware, getRecommendations);

module.exports = router;