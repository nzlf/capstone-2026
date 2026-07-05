const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Endpoint untuk checkout: POST /api/orders/checkout
router.post('/checkout', orderController.checkout);

// Endpoint mengambil riwayat order user: GET /api/orders/user/:id_user
router.get('/user/:id_user', orderController.getUserOrders);

module.exports = router;