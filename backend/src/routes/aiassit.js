const express = require('express')
const airouter = express.Router();
const usermiddleware = require('../middleware/usermiddleware')
const solvedought = require('../controllers/solvedought')

airouter.post('/chat',usermiddleware,solvedought)

module.exports = airouter