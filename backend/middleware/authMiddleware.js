const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization

    if(!token) {
        return res.json({message: "No Token"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey")
        req.user = decoded
        next()
    }
    catch(err){
        res.json({message: "Invalid token"})
    }
}

//Admin only
const isAdmin = (req, res, next) => {
    if(req.user.role !== "admin") {
        return res.json({message: "Access Denied (Admin only)"});
    }
    
}

module.exports = {verifyToken, isAdmin};