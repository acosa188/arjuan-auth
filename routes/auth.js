const router = require('express').Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details.map(x=>x.message).join('\n'));
    
    // Check if user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send(`${req.body.email} already exists`);

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        await user.save();
        // create the token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        res.send({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token
            }
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post("/login", async (req, res)=>{
    
    // Validate inputs
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details.map(x=>x.message).join('\n'));

    // Check if email is already in the database
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Email or Password is incorrect.");

    // Check if it is a valid password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("Email or Password is incorrect.");

    // Create and assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header("auth-token", token).send(token);
});

module.exports = router;