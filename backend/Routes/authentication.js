const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Account = require('../models/Account');
const {body , validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fetchuser = require('../middleware/fetchuser')
const blacklistedTokens = new Set();
//--------------------------- user registration ---------------------------------------------------------

router.post('/register' , [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({min:9})  
],  async(req,res)=>{
    
    const {name , email , password} = req.body;
    const result = validationResult(req);
    if(!result.isEmpty())
    {
        return res.status(400).json({error : result.array()})
    }

    try {
        let user = await User.findOne({email});

        if(user)
        {
            return res.status(400).json("User with this email already exist");
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);


        user = await User.create({
            name,
            email,
            password:secPass
        })

        const data = {
            user : {
                id : user.id
            }
        }

        const account = await Account.create({
            user: user._id,
            balance: 0
        });

        const token = jwt.sign(data , process.env.JWT_SECRET);


        res.json({token , account});
        
    } catch (error) {
        console.error(error.message); // Log the error message for debugging
        res.status(500).json("Internal server error");
    }
   
})


//--------------------------------login---------------------------------------------------------

router.post('/login' ,[
    body('email').isEmail(),
    body('password').isLength({min:9})
], async(req,res)=>{
    
    const result = validationResult(req);
    if(!result.isEmpty())
    {
        return res.status(400).json({error:result.array()});
    }

    try {
        
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user)
        {
            return res.status(400).json("The user with this email does not exist");
        }
      
        const comparePass = await bcrypt.compare(password , user.password);
        if(!comparePass)
        {
            return res.status(400).json("Login with the correct credentials");
        }

        const data = {
            user :{
                id : user.id
            }
        }

        const token = jwt.sign(data , process.env.JWT_SECRET);
        res.json({token});

    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Internal server error");
    }

})

// ------------------------------------fetch user details ------------------------------------------

router.get('/getuser' , fetchuser(blacklistedTokens) , async(req,res)=>{
 
try {

    const id = req.user.id;
   const user = await User.findById(id).select("-password");

   res.json({user});

    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Internal server error");
    }
   
})


//----------------------------------- logout ----------------------------------------------------

router.post('/logout' , async(req,res)=>{

    const token = req.header('token');
    blacklistedTokens.add(token);

    return res.json("Successfully logged out!")
})

module.exports = router;
module.exports.blacklistedTokens = blacklistedTokens;

