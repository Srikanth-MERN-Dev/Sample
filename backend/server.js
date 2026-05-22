require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const {userDB, productDB, orderDB, cartDB} = require('./config/db');

const app = express();

const productRoutes = require('./Routes/productRoutes')
const orderRoutes = require('./Routes/orderRoutes')
const authRoutes = require('./Routes/authRoutes')
const cartRoutes = require('./Routes/cartRoutes')




app.use(express.json({limit: "10mb"}));
app.use(cors({
    origin: "https://healthy-food-frontend.onrender.com",
    credentials: true
}));


//Product Routes
app.use('/products', productRoutes)

//auth User Routes
app.use('/auth', authRoutes)

//cart Routes
app.use('/cart', cartRoutes)


//Order Router
app.use('/orders', orderRoutes)





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening to ${PORT}`);
});
