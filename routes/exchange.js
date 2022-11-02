const express = require("express")
const {
    getExchangeList
} = require("../controllers/exchangeController")
const requireAuth = require('../middleware/requireAuth')


const router = express.Router()

router.use(requireAuth)

// GET Exchange List
router.get('/', getExchangeList)


module.exports = router