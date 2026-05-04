const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const {verifyToken, isAdmin} = require("../middleware/authMiddleware")



//REGISTER
router.post("/register", async (req, res) => {
    try{
        const { name, email, password, role } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({success: false,
                message: "Name, email, and password are required"
            });
        }

        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(409).json({ success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword, role: role || "user"});
        await user.save();
        res.status(201).json({ success: true, message: "Registered" })
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message})
    }
})

//Login
router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Wrong password" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1w" });

        res.json({ success: true, message: "Login success", token, role: user.role });
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
})

router.get('/register', verifyToken, async(req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
})

router.put('/register', verifyToken, async (req,res) => {
    try{
        const {name, email} = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {name, email}, {new: true}).select("-password");
        res.json({message: "Profile Updated", user: updatedUser});
    }
    catch (error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
})


module.exports = router;
