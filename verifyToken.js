const jwt = require("jsonwebtoken");

function auth (req, res, next){

    // Check if auth-token is in the header
    const token = req.header('auth-token');
    if(!token) return res.status(401).send("Access denied");

    // Verify if token is valid
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err){
        res.status(400).send("Invalid token");
    }
}

module.exports = auth;