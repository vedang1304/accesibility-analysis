const mongoose=require('mongoose')
const {Schema}=mongoose
const validator = require('validator')

const NodeSchema = new Schema({
    html:{
        type:String,
        required:true
    },
    target:{
        type:[String],
        required:true
    },
    failureSummary:{
        type:String,
        required:true
    }
},{_id:false});


const violationSchema = new Schema({
    id:{
        type:String,
        require:true
    },
    impact:{
        type:String,
        enum: ['minor', 'moderate', 'serious', 'critical'],
        required:true
    },
    description:{
        type:String,
        required:true
    },
    help:{
        type:String,
        required:true
    },
    helpUrl:{
        type:String,
        required:true,
        validate: {
          validator: function (v) {
              return /^https?:\/\/.+$/.test(v);  // basic URL check
            },
           message: props => `${props.value} is not a valid URL!`,
        },
    },
    tags: [String],
    nodes:{
        type:[NodeSchema],
    }
},{_id:false})

module.exports = violationSchema