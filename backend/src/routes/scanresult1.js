const express = require('express')
const scanrouter = express.Router();
const usermiddleware = require('../middleware/usermiddleware')
const {submiturl,allresult,generateresult,deleteresult,scansbyuser} = require('../controllers/results')

scanrouter.post('/result',usermiddleware,submiturl)
scanrouter.get('/resultscanned',usermiddleware,allresult)
scanrouter.get('/generateresult/:id',usermiddleware,generateresult)
scanrouter.get('/scansbyuser',usermiddleware,scansbyuser)
scanrouter.delete('/deleteresult/:id',usermiddleware,deleteresult)


module.exports = scanrouter


