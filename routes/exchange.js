const express = require("express")
const {
    getExchangeList
} = require("../controllers/exchangeController")

const router = express.Router()

// GET Exchange List
router.get('/', getExchangeList)


module.exports = router