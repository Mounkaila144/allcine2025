const router = require('express').Router();
const {
    createOrder,
    getUserOrders,
    updateOrderStatus
} = require('../controllers/order.controller');
const { authMiddleware, tenantFilter } = require('../middleware/auth.middleware');
const { Order } = require('../models');

router.post('/', [authMiddleware], createOrder);
router.get('/', [authMiddleware], getUserOrders);
router.put('/:id', [authMiddleware], updateOrderStatus);

module.exports = router;