const express = require("express");
const router = express.Router();

const { createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts, } = require("../controllers/products");


// Create a new product
router.post('/products', createProduct);

// Get all products
router.get('/products', getAllProducts);

// Get a specific product by ID
router.get('/products/:productId', getProductById);

// Update a product by ID
router.put('/products/:productId', updateProduct);

// Delete a product by ID
router.delete('/products/:productId', deleteProduct);

// Search products
router.get('/products/search', searchProducts);


module.exports = router;