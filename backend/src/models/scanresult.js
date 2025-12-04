const mongoose=require('mongoose')
const {Schema}=mongoose
const violationSchema = require('./violations')
const validator=require("validator");


const scanschema = new Schema({
    url:{
        type:String,
        required:true,
        validate: {
           validator: v => /^https?:\/\/.+$/.test(v),
           message: props => `${props.value} is not a valid URL!`,
        },
    },
    scandate:{
        type:Date,
        default:Date.now()
    },
    totalviolations:{
        type:Number,
        default:0,
        required:true
    },
    issuesByImpact:{
        minor:{type:Number,default:0},
        moderate:{type:Number,default:0},
        serious:{type:Number,default:0},
        critical:{type:Number,default:0}
    },
    violations:{
        type:[violationSchema],
        required:true
    },

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {timestamps:true})

const ScanSchema = mongoose.model('scanresult',scanschema)

module.exports = ScanSchema;