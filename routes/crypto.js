const express = require("express")
const {
    getCryptoList,
    getCryptoDetails
} = require("../controllers/crytoControllers")

const router = express.Router()

// GET Crypto List
router.get('/cryptoList', getCryptoList)

// POST Crypto Details
router.post('/cryptoDetail', getCryptoDetails)


module.exports = router