const mongoose = require('mongoose');
const {loginUserDB} = require('../config/db')

const loginUserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        roleBase: ["user", "admin"],
        default: "user"
    }
})

module.exports = loginUserDB.model('LoginUser', loginUserSchema);