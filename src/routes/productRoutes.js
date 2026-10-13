const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/productController');
const { requireAuth, optionalAuth } = require('../middlewares/authMiddleware');

// GET /api/products - list all products
router.get('/', optionalAuth, getProducts);

// POST /api/products - add product (requires user to be logged in)
router.post('/', requireAuth, createProduct);

module.exports = router;
