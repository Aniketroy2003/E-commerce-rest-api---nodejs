import chai from 'chai';
const mongoose = require('mongoose');
const { expect } = chai;
const Product = require('../models/product');

describe('Product Model', () => {
    before(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    after(async () => {
        await mongoose.connection.close();
    });

    it('should store and retrieve data correctly', async () => {
        const productData = {
            name: 'Test Product',
            description: 'This is a test product',
            price: 10.99,
            variants: [
                { name: 'Variant 1', sku: 'SKU1', additionalCost: 2.5, stockCount: 50 },
                { name: 'Variant 2', sku: 'SKU2', additionalCost: 1.5, stockCount: 30 },
            ],
        };

        // Create a new product
        const product = await Product.create(productData);

        // Retrieve the product from the database
        const retrievedProduct = await Product.findById(product._id).populate('variants');

        // Assert that the stored data matches the expected data
        expect(retrievedProduct.name).to.equal(productData.name);
        expect(retrievedProduct.description).to.equal(productData.description);
        expect(retrievedProduct.price).to.equal(productData.price);
        expect(retrievedProduct.variants).to.have.lengthOf(2);
        expect(retrievedProduct.variants[0].name).to.equal(productData.variants[0].name);
        expect(retrievedProduct.variants[1].sku).to.equal(productData.variants[1].sku);
    });
});
