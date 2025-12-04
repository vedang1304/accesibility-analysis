const mongoose=require('mongoose')
const {Schema}=mongoose

const userSchema=new Schema({
    firstName:{
        type: String,
        minlength:3,
        required: true, 
    },
    lastname:{
        type:String,
        minlength:2
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true
    },
    password:{
        type:String,
        required:true
    },
    scansall:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'scanresult',
    unique:true
  }],
},{timestamps:true})

const User=mongoose.model("user",userSchema);

module.exports=User