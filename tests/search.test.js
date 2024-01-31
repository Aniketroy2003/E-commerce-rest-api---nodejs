import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import Product from '../models/product';

const { expect } = chai;
chai.use(chaiHttp);

describe('Product Search Functionality', () => {
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

    it('should return correct results for a search query', async () => {
        await Product.create({
            name: 'Laptop',
            description: 'Powerful laptop with high performance',
            price: 1299.99,
            variants: [{ name: 'Color', sku: 'CL1', additionalCost: 50.0, stockCount: 10 }],
        });

        await Product.create({
            name: 'Smartphone',
            description: 'Latest smartphone with advanced features',
            price: 799.99,
            variants: [{ name: 'Storage', sku: 'ST1', additionalCost: 30.0, stockCount: 15 }],
        });

        const res = await chai.request(app).get('/api/products/search?query=laptop');

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].name).toBe('Laptop');
    });

    it('should handle missing query parameter gracefully', async () => {
        const res = await chai.request(app).get('/api/products/search');

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Query parameter is required for search');
    });

    it('should handle non-matching search query', async () => {
        await Product.create({
            name: 'Laptop',
            description: 'Powerful laptop with high performance',
            price: 1299.99,
            variants: [{ name: 'Color', sku: 'CL1', additionalCost: 50.0, stockCount: 10 }],
        });

        const res = await chai.request(app).get('/api/products/search?query=phone');

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toHaveLength(0);
    });

    // ... additional search functionality tests
});
