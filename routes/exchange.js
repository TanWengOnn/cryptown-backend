const express = require("express")
const {
    getExchangeList
} = require("../controllers/exchangeController")
const requireAuth = require('../middleware/requireAuth')
const { publicCache } = require('../middleware/responseHeader')

const router = express.Router()

router.use(publicCache)

// GET Exchange List
router.get('/', getExchangeList)


module.exports = router