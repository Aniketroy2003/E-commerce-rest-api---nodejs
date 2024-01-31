// const getAllProducts = async (req, res) => {
//     res.status(200).json({ msg: "I am getAllProducts" });
// };

// const getAllProductstesting = async (req, res) => {
//     res.status(200).json({ msg: "I am getAllProductstesting" });
// };

const Product = require('../models/product');
const Variant = require('../models/variant');

// const productController = {
const createProduct = async (req, res) => {
    try {
        const { name, description, price, variants } = req.body;

        // Create the product
        const product = new Product({ name, description, price });

        // Create and associate variants with the product
        if (variants && variants.length > 0) {
            const variantObjects = variants.map((variant) => new Variant(variant));
            product.variants = await Variant.insertMany(variantObjects);
        }

        // Save the product to the database
        await product.save();

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('variants');
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId).populate('variants');

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { name, description, price, variants } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update product details
        product.name = name;
        product.description = description;
        product.price = price;

        // Delete existing variants and create new ones
        if (variants && variants.length > 0) {
            await Variant.deleteMany({ _id: { $in: product.variants } });
            const variantObjects = variants.map((variant) => new Variant(variant));
            product.variants = await Variant.insertMany(variantObjects);
        } else {
            product.variants = [];
        }

        await product.save();

        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete associated variants
        await Variant.deleteMany({ _id: { $in: product.variants } });

        // Delete the product
        await Product.findByIdAndDelete(productId);

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const searchProducts = async (req, res) => {
    try {
        const query = req.query.query;

        const results = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { 'variants.name': { $regex: query, $options: 'i' } },
            ],
        }).populate('variants');

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// module.exports = productController;
module.exports = {createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts, };