const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true },
    additionalCost: { type: Number, required: true },
    stockCount: { type: Number, required: true },
});

module.exports = mongoose.model('Variant', variantSchema);