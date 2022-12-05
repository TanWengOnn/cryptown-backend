const express = require("express")
const {
    getExchangeList
} = require("../controllers/exchangeController")
const { publicCache } = require('../middleware/responseHeader')

const router = express.Router()

// cloudflare caching
router.use(publicCache)

// GET Exchange List
router.get('/', getExchangeList)


module.exports = router