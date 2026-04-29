const express = require('express')
const router = express.Router();
const Cart = require('../models/cartModels');
const Product = require('../models/productModel');
const User = require("../models/userModel");
const Order = require('../models/orderModel');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware')



//place order
router.post('/place', verifyToken, async (req, res) => {
    try {
        const { name, address, mobileNumber, productId } = req.body;

        if (productId) {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            const order = new Order({
                userId: req.user.id,
                products: [{ productId: product._id, qty: 1 }],
                totalAmount: product.price,
                name,
                address,
                mobileNumber,
            });
            await order.save();

            return res.json({ message: "Order Placed Successfully" });
        }

        const cart = await Cart.findOne({ userId: req.user.id}).populate({
            path: "products.productId",
            model: Product
        });
        if(!cart || cart.products.length === 0){
            return res.json({message: "Cart is Empty"});
        }

        //Calculate total
        let total = 0;
        cart.products.forEach(item => {
            if (item.productId && typeof item.productId.price === 'number') {
                total += item.productId.price * item.qty;
            }
        });

        const order = new Order({
            userId: req.user.id,
            products: cart.products,
            totalAmount: total,
            name,
            address,
            mobileNumber
        });
        await order.save();

        //clear cart
        cart.products = [];
        await cart.save();

        res.json({ message: "Order Placed Successfully" })
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message })
    }
})

//get my orders
router.get('/', verifyToken, async (req, res) => {
    try{
        const orders = await Order.find({ userId: req.user.id});

        //Manually populate product details since they're in different databases
        const populatedOrders = await Promise.all(
            orders.map(async (order) => {
                const populatedProducts = await Promise.all(
                    order.products.map(async (item) => {
                        try {
                            const product = await Product.findById(item.productId);
                            return {
                                ...item.toObject(),
                                productId: product || { name: "Product not found", price: 0, image: null }
                            };
                        }catch(error) {
                            console.log(`Error fetching product ${item.productId}:`, error);
                            return {
                                ...item.toObject(),
                                productId: { name: "Product not found", price: 0, image: null }
                            };
                        };
                    })
                );
                return {
                    ...order.toObject(),
                    products: populatedProducts
                };
            })
        );

        res.json(populatedOrders);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message })
    }
})
 

//Admin get all orders
router.get('/admin/all', verifyToken, async(req, res) => {
    try{
        const orders = await Order.find()
        //user populate
        .populate({
            path: "userId",
            model: User,
            select: "name"
        })
        //Product populate
        .populate({
            path: "products.productId",
            model: Product,
        });
        res.json(orders);
    }
    catch(error){
        res.status(500).json({ message: error.message})
    }
})

//update order status
router.put('/admin/status/:id', verifyToken, async (req, res) => {
    try{
        const {status} = req.body;
        await Order.findByIdAndUpdate(req.params.id, {status});
        res.json({message: "Status Updated"})
    }
    catch(error) {
        console.log(error);
        res.status(500).json({message: error.message })
    }
})






// //Orders Update Method
// router.put('/:id', async(req, res) => {
//     try{
//         const { name, mobileNumber, address } = req.body;
//         const id = req.params.id;
//         const updateOrder = await Order.findByIdAndUpdate(id, {
//             name, mobileNumber, address
//         })
//         if(!updateOrder) {
//             res.status(404).json({ message: "Order Not Found" })
//         }
//         res.json(updateOrder)
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).json({ message: error.message })
//     }
// })



//Order Delete Method
router.delete('/:id', async (req, res) => {
    try{
        const id = req.params.id;
        await Order. findByIdAndDelete(id);
        res.status(204).end();
    }
    catch (error){
        console.log(error);
        res.status(500).json({ message: error.message })
    }
})

//Cancel order
router.delete('/:id/cancel', verifyToken, async (req, res) => {
    try{
        const orderId = req.params.id;
        const userId = req.user.id;

        const order = await Order.findOne({_id: orderId, userId });

        if(!order) {
            return res.status(404).json({message: "Order not found"});
        }

        if(order.status !== "Pending" && order.status !== "preparing") {
            return res.status(400).json({ message: "Only pending orders can be cancelled" });
        }


        await Order.findByIdAndDelete(orderId);
        res.json({ message: "Order cancelled successfully" });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message })
    }
})


module.exports = router;


