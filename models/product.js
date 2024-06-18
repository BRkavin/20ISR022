const mongoose = require('mongoose');
const { Decimal128 } = require('mongodb');

const productSchema = new mongoose.Schema({
    ProductName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Decimal128,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    availability: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);
