const jwt = require('jsonwebtoken');
require('dotenv').config();


const fetchuser = (blacklistedTokens)=>{

    return (req,res,next)=>{
    try {

        const token = req.header('token');
    if(!token)
    {
        return res.status(401).json("Please authenticate using valid token");
    }
    if(blacklistedTokens.has(token))
    {
        return res.status(403).json("The authentication token has been expired");
    }
    
    const data = jwt.verify(token , process.env.JWT_SECRET);
    req.user = data.user;
    next();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Internal server error");
    } 
}
  
}

module.exports = fetchuser;