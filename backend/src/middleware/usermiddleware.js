const redisclient = require('../config/redis');
const User=require('../models/user')
const jwt=require('jsonwebtoken')

const usermiddleware = async (req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token)
            throw new Error("invalid Token")

        const payload = jwt.verify(token,process.env.JWT_KEY)

        const {_id} = payload;
        if(!_id)
            throw new Error("invalid id")
        
        const result=await User.findById(_id);

        if(!result)
            throw new Error("invalid user")

        const isblocked=await redisclient.exists(`token:${token}`)

        if(isblocked)
            throw new Error("Usre is blocked")

        req.result=result

        next();
    }
    catch(err){
        res.send("error: "+err)
    }
}

module.exports = usermiddleware