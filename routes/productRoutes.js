const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Endpoint: GET /api/products
router.get('/', productController.getAllProducts);

// Endpoint: GET /api/products/:id
router.get('/:id', productController.getProductDetail);

// Endpoint: POST /api/products
router.post('/', productController.createProduct);

// Endpoint PUT untuk update dan DELETE untuk hapus
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;