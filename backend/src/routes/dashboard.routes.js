const router = require('express').Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');

router.get('/stats', [authMiddleware, isAdmin], getDashboardStats);

module.exports = router;