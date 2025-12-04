const express=require('express')
const app=express();
require('dotenv').config();
const main = require('./config/db')
const cookie=require('cookie-parser');
const cookieParser = require('cookie-parser');
const authrouter = require('./routes/userAuth');
const redisclient = require('./config/redis');
const scanrouter = require('./routes/scanresult1')
const airouter = require('./routes/aiassit')
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}))

app.use(express.json());
app.use(cookieParser());

app.use('/user',authrouter)
app.use('/scan',scanrouter)
app.use('/ai',airouter)


const initializeconn = async ()=>{
    try{
        await Promise.all([main(),redisclient.connect()])
        console.log("DB Connected")

        app.listen(process.env.PORT,()=>{
        console.log("listening at: " + process.env.PORT);
        })
    }
    catch(err){
        console.log("error: "+err)
    }
}


initializeconn();


