const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Endpoint untuk checkout: POST /api/orders/checkout
router.post('/checkout', orderController.checkout);

// Endpoint mengambil riwayat order user: GET /api/orders/user/:id_user
router.get('/user/:id_user', orderController.getUserOrders);

// Endpoint mengambil semua order (untuk admin): GET /api/orders
router.get('/', orderController.getAllOrders);

// Endpoint untuk update order (status, resi): PUT /api/orders/:id
router.put('/:id', orderController.updateOrder);

// Endpoint untuk hapus order: DELETE /api/orders/:id
router.delete('/:id', orderController.deleteOrder);

module.exports = router;