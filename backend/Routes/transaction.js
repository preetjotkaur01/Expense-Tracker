const express = require('express');
const router = express.Router();
const { blacklistedTokens } = require('../Routes/authentication');
const User =  require('../models/User');
const Account = require('../models/Account');
const fetchuser = require('../middleware/fetchuser')
const {body , validationResult} = require('express-validator');

//----------------------------------- transaction ------------------------------------------//


router.post('/transaction' , fetchuser(blacklistedTokens) , [
    body('amount').isFloat({gt:0.0}),
    body('type').notEmpty()
], async(req,res)=>{
     
    const {amount , type , description} = req.body;
    const result = validationResult(req);
    if(!result.isEmpty())
    {
        return res.status(400).json({error:result.array()});
    }
    
    try {
        const id = req.user.id;
        const user = await User.findById(id);

       const account = await Account.findOne({user : user._id});

        if(!account)
        {
            return res.status(404).json("Account not found");
        }

        if(type === 'Credit')
            account.balance += amount;
        
        if(type === 'Debit')
            account.balance -= amount;

        const transaction = {amount , type ,description};
        account.transactions.push(transaction);
        await account.save();
        
        res.json(transaction);


    } catch (error) {
       console.log(error.message);
       return res.status(500).json("Internal Server Error"); 
    }
  
});

//------------------------------get all transactions ------------------------------------------
router.get('/getTransactions',fetchuser(blacklistedTokens), async(req,res)=>{

    try {
        
        const id = req.user.id;
    const user = await User.findById(id);

    const account = await Account.findOne({user : user._id});
    if(!account)
    {
        return res.status(401).json("Account not found");
    }
    res.json(account.transactions);

    } catch (error) {
        console.log({error:error.message});
        return res.status(500).json("Internal Server Error");

    }

    

})

////--------------------------------- get balance -----------------------------------------
router.get('/getBalance' , fetchuser(blacklistedTokens) , async(req,res)=>{
    try {
        const id = req.user.id;
        const user = await User.findById(id);
        const account = await Account.findOne({user : user._id});
        if(!account)
        {
            res.status(401).json("Account not found");
        }

        res.json({Balance : account.balance});

    } catch (error) {
        console.log({error:error.message});
        return res.status(500).json("Internal Server Error");
    }
})

module.exports = router;