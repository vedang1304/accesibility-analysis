const redisclient = require('../config/redis')
const User=require('../models/user')
const validate=require('../utils/validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const registeruser = async (req,res)=>{
    try{

        validate(req.body)
        const {firstName,emailId,password} = req.body
 
        req.body.password=await bcrypt.hash(password,10)
        const user = await User.create(req.body)

        const token = jwt.sign({_id:user._id,emailId:emailId},process.env.JWT_KEY,{expiresIn:60*60})
        res.cookie('token',token,{maxAge:60*60*1000})

        const reply = {
        firstName: user.firstName,
        emailId: user.emailId,
        _id: user._id,
      }

        res.status(201).json({
            user:reply,
            message:"registered Successfully"
        })

    }
    catch(err){
        res.send("error" + err)
    }
}

const loginuser = async (req,res)=>{
    try{
       const {emailId,password}=req.body
       if(!emailId)
           throw new Error("Enter email")
       if(!password)
           throw new Error("enter password")

        const user = await User.findOne({emailId})

        const match=bcrypt.compare(password,user.password)

       if(!match)
           throw new Error("Invalid Credentials")

       const token = jwt.sign({_id:user._id,emailId:emailId},process.env.JWT_KEY,{expiresIn:60*60})
       res.cookie('token',token,{maxAge:60*60*1000})

       const reply = {
        firstName: user.firstName,
        emailId: user.emailId,
        _id: user._id,
      }



       res.status(201).json({
            user:reply,
            message:"logged in  Successfully"
        })
    }
    catch(err){
        res.status(401).send("error"+err)
    }
}

const logoutuser = async (req,res)=>{
    try{
        const {token} = req.cookies
        const payload = jwt.decode(token)

        await redisclient.set(`token:${token}`,`blocked`)
        await redisclient.expireAt(`token:${token}`,payload.exp)

        res.cookie('token',null,{expires:new Date(Date.now())});
        res.send("logged out succesfully")

    }
    catch(err){
        res.status(503).send("error for logging"+err)
    }
}

const getprofile = async (req,res)=>{
    try{
       const userId = req.result._id;
       if(!userId){
        throw new Error("invalid Id")
       }
       const info = await User.findById(userId);

       res.status(201).json({
        info:info,
        message:"profile fetched successufully"
       })
    }
    catch(err){
        res.send("can not fetch profile details"+err)
    }
}

const profileupdate = async (req,res)=>{
    try{
        const userId = req.result._id;
        const {firstName,lastname,emailId,password} = req.body;
        if(!userId) throw new Error("invalid id");

        await User.findByIdAndUpdate(userId,{...req.body},{ new: true, runValidators: true });
        const updated = {
            firstName:firstName,
            lastname:lastname,
            emailId:emailId,
            password:password
        }

        res.send.json({
            data:updated,
            message:"updated sucessfully"
        })
    }
    catch(err){
        res.send("cannot update"+err)
    }
}

module.exports = {registeruser,loginuser,logoutuser,getprofile,profileupdate}
