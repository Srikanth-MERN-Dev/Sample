const mongoose = require('mongoose');

const {productDB} = require('../config/db');

const productSchema = new mongoose.Schema({
    image : {
        required: true,
        type:String
        
    },
    name :{
        required:true,
        type:String
    },
    description :{
        required:true,
        type:String
    },
   
    price : {
        required:true,
        type:Number
    },
    actualPrice : {
        required:true,
        type:String
    }
})

module.exports = productDB.model('Product',productSchema)
