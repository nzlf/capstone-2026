const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Endpoint: POST /api/payments
router.post('/', paymentController.processPayment);

module.exports = router;