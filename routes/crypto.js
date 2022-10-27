const express = require("express")
const {
    getCryptoList
} = require("../controllers/crytoControllers")

const router = express.Router()

// GET Crypto List
router.get('/', getCryptoList)


module.exports = router