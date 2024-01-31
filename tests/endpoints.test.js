import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import Product from '../models/product';

const { expect } = chai;
chai.use(chaiHttp);

describe('Product Endpoints', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Product.deleteMany({});
    });

    it('should create a new product', async () => {
        const newProduct = {
            name: 'New Product',
            description: 'This is a new product',
            price: 19.99,
            variants: [
                { name: 'New Variant 1', sku: 'NEW1', additionalCost: 3.0, stockCount: 20 },
            ],
        };

        const res = await chai.request(app).post('/api/products').send(newProduct);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Product created successfully');
        expect(res.body.product).toHaveProperty('_id');
        expect(res.body.product.name).toBe(newProduct.name);
    });

    it('should retrieve all products', async () => {
        await Product.create({
            name: 'Product 1',
            description: 'Description 1',
            price: 15.99,
            variants: [{ name: 'Variant 1', sku: 'SKU1', additionalCost: 2.0, stockCount: 30 }],
        });

        await Product.create({
            name: 'Product 2',
            description: 'Description 2',
            price: 24.99,
            variants: [{ name: 'Variant 2', sku: 'SKU2', additionalCost: 1.5, stockCount: 25 }],
        });

        const res = await chai.request(app).get('/api/products');

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].name).toBe('Product 1');
        expect(res.body[1].price).toBe(24.99);
    });

    it('should retrieve a specific product by ID', async () => {
        const product = await Product.create({
            name: 'Product 1',
            description: 'Description 1',
            price: 15.99,
            variants: [{ name: 'Variant 1', sku: 'SKU1', additionalCost: 2.0, stockCount: 30 }],
        });

        const res = await chai.request(app).get(`/api/products/${product._id}`);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Product 1');
        expect(res.body.variants).toHaveLength(1);
        expect(res.body.variants[0].sku).toBe('SKU1');
    });

    it('should update a product by ID', async () => {
        const product = await Product.create({
            name: 'Product 1',
            description: 'Description 1',
            price: 15.99,
            variants: [{ name: 'Variant 1', sku: 'SKU1', additionalCost: 2.0, stockCount: 30 }],
        });

        const updatedProduct = {
            name: 'Updated Product',
            description: 'Updated Description',
            price: 29.99,
            variants: [{ name: 'Updated Variant', sku: 'UPD1', additionalCost: 5.0, stockCount: 40 }],
        };

        const res = await chai.request(app).put(`/api/products/${product._id}`).send(updatedProduct);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Product updated successfully');
        expect(res.body.product._id).toBe(product._id.toString());
        expect(res.body.product.name).toBe('Updated Product');
    });

    it('should delete a product by ID', async () => {
        const product = await Product.create({
            name: 'Product 1',
            description: 'Description 1',
            price: 15.99,
            variants: [{ name: 'Variant 1', sku: 'SKU1', additionalCost: 2.0, stockCount: 30 }],
        });

        const res = await chai.request(app).delete(`/api/products/${product._id}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Product deleted successfully');

        // Verify that the product is no longer in the database
        const deletedProduct = await Product.findById(product._id);
        expect(deletedProduct).toBeNull();
    });

    // ... additional endpoint tests
});
