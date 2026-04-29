const express = require("express");
const router = express.Router();
const Cart = require('../models/cartModels');
const Product = require('../models/productModel')
const { verifyToken, isAdmin } = require('../middleware/authMiddleware')

//Add To Cart
router.post('/add', verifyToken, async (req,res) => {
    try{
        const { productId } = req.body

        if(!productId) {
            return res.status(400).json({message: "Product ID missing"});
        }
        const userId = req.user.id

        let cart = await Cart.findOne({ userId });

        //create cart
        if(!cart) {
            cart = new Cart({
                userId, products: [{ productId, qty: 1}]
            });
        }else {
            //check existing product
            const item = cart.products.find((p) => p.productId && p.productId.toString() === productId);
        if(item) {
            item.qty += 1;
        }else{
            cart.products.push({ productId, qty: 1 });
        }        
    }
    await cart.save();
    res.json({ message: "Added to cart successfully" })
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

//Get Cart
router.get('/', verifyToken, async (req, res) => {
    try{
        const cart = await Cart.findOne({ userId: req.user.id})
        if(!cart){
            return res.json({ products: [] })
        }

        //manual populate
        const updatedProducts = await Promise.all(cart.products.map(async (item) => {
            const product = await Product.findById(item.productId)

            return{
                productId: product,
                qty: item.qty
            }
        }))
        res.json({ products: updatedProducts })
    }
    catch(error) {
        res.status(500).json({ message: error.message });
    }
})

router.put('/update', verifyToken, async (req, res) => {
    try{
        const {productId, type} = req.body;

        const cart = await Cart.findOne({userId: req.user.id});
        if(!cart) {
            return res.status(400).json({ message: "Crt Not Found"})
        }

        const item = cart.products.find((p)=> p.productId && p.productId.toString() === productId);
        if(!item) {
            return res.status(400).json({ message: "Product not found in cart"})
        }

        //Logic

        if(type == "inc") {
            item.qty += 1
        } else if (type === "dec") {
            if(item.qty > 1){
                item.qty -= 1
            } else{
                //Remove item if qty becomes 0
                cart.products = cart.products.filter((p) => p.productId.toString() !== productId);
            }
        }
        await cart.save();
        res.json({ message: "Qty updated" })
    }
    catch(error){
        console.log(error);
        res.statuse(500).json({ message: errror.message })
    }
})

router.delete('/remove/:id', verifyToken, async (req, res) => {
    try{
        const userId = req.user.id;
        const productId = req.params.id;

        const cart = await Cart.findOne({ userId })
        if(!cart){
            return res.status(400).json({ message: "Cart Not Found"})
        }

        //filter remove
        cart.products = cart.products.filter((item) => item.productId.toString() !== productId)
        await cart.save();
        res.json({message: "Item removed successfully"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;