const mongoose = require('mongoose');
const {cartDB} = require('../config/db');

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            qty:{
                type: Number,
                default: 1,
                min: 1
            },
        }
    ]
});

module.exports = cartDB.model("Cart", CartSchema);