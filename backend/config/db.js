const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

//user database
const userDB = mongoose.createConnection(`${mongoURI}/user`)
userDB.on('connected',()=>{
    console.log('user DB Connected');

})
userDB.on('error',(error)=>{
    console.log(error)
})


//Products Database
const productDB = mongoose.createConnection(`${mongoURI}/product`)
productDB.on('connected',()=>{
    console.log('product DB Connected')
})
productDB.on('error',(error)=>{
    console.log(error)
})
//orders Database
const orderDB = mongoose.createConnection(`${mongoURI}/orders`)
orderDB.on('connected',()=>{
    console.log('Order DB Connected')
})
orderDB.on('error',(error)=>{
    console.log(error)
})
//cart Database
const cartDB = mongoose.createConnection(`${mongoURI}/cartdb`)
cartDB.on('connected', () => {
    console.log('Cart DB Connected')
})
cartDB.on('error', (error) => {
    console.log(error)
})

module.exports = {userDB,productDB,orderDB,cartDB}
