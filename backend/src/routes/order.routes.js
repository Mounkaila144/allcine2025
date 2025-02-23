// order.routes.js
const router = require('express').Router();
const {
    createOrder,
    getUserOrders,
    updateOrderStatus,
    deleteOrder // Importez la nouvelle fonction deleteOrder
} = require('../controllers/order.controller');
const { authMiddleware, tenantFilter } = require('../middleware/auth.middleware');
const { Order } = require('../models');

router.post('/', [authMiddleware], createOrder);
router.get('/', [authMiddleware], getUserOrders);
router.put('/:id', [authMiddleware], updateOrderStatus);
router.delete('/:id', [authMiddleware], deleteOrder); // Ajoutez la route pour supprimer une commande

module.exports = router;