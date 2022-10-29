const express = require("express")
const {
    getCryptoList,
    getCryptoDetails
} = require("../controllers/crytoControllers")
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

// GET Crypto List
router.get('/cryptoList', getCryptoList)

// POST Crypto Details
router.post('/cryptoDetail', getCryptoDetails)


module.exports = router