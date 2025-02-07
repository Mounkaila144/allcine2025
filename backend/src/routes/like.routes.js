const router = require('express').Router();
const {
    toggleLike,
    getUserLikes,
    getLikesCount
} = require('../controllers/like.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.post('/toggle', authMiddleware, toggleLike);
router.get('/user', authMiddleware, getUserLikes);
router.get('/count/:content_id', authMiddleware, getLikesCount);

module.exports = router;
