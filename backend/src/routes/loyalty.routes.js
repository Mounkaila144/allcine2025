const router = require('express').Router();
const {
    getLoyaltyStatus,
    updateLoyaltyStamps,
    resetLoyaltyStamps, createLoyaltyStatus
} = require('../controllers/loyalty.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.get('/status', authMiddleware, getLoyaltyStatus);
router.put('/stamps', authMiddleware, updateLoyaltyStamps);
router.put('/reset', authMiddleware, resetLoyaltyStamps);
router.post('/create', authMiddleware, createLoyaltyStatus);


module.exports = router;