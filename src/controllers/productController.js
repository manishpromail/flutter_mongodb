const Product = require('../models/Product');

/**
 * Get all products
 * GET /api/products
 */
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ created_at: -1 });

    return res.status(200).json({
      success: true,
      data: products || []
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching products',
      error: err.message
    });
  }
};

/**
 * Create a new product
 * POST /api/products
 */
const createProduct = async (req, res) => {
  try {
    const { title, description, price, image_url } = req.body;

    if (!title || price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: 'Title and price are required'
      });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number'
      });
    }

    const newProduct = await Product.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      price: parsedPrice,
      image_url: image_url && image_url.trim().length > 0
        ? image_url.trim()
        : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      user_id: req.user?.id || null
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct.toJSON()
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error creating product',
      error: err.message
    });
  }
};

module.exports = {
  getProducts,
  createProduct
};
