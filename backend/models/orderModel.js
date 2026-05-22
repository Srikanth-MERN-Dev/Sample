const mongoose = require('mongoose')
const {orderDB} = require('../config/db')


const orderSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        qty: {
            type: Number,
            default: 1,
            min: 1
        },
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    name: String,
    address: String,
    mobileNumber: Number,
    status:{
        type: String,
        default: "Pending",
    }
}, {timestamps: true});


module.exports = orderDB.model('Order',orderSchema);
