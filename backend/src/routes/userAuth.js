const express = require('express')
const authrouter = express.Router();
const {registeruser,loginuser,logoutuser,getprofile,profileupdate}=require('../controllers/userauthentication')
const usermiddleware = require('../middleware/usermiddleware')

authrouter.post('/register',registeruser);
authrouter.post('/login',loginuser);
authrouter.post('/logout',usermiddleware,logoutuser);
authrouter.get('/getprofile',usermiddleware,getprofile);
authrouter.put('/updateprofile',usermiddleware,profileupdate)
authrouter.get('/check',usermiddleware,(req,res)=>{

    const reply = {
        firstName: req.result.firstName,
        emailId: req.result.emailId,
        _id:req.result._id,
    }

    res.status(200).json({
        user:reply,
        message:"Valid User"
    });
})

module.exports = authrouter