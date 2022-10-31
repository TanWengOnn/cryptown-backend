const express = require("express")
const {
    getCryptoList,
    getCryptoDetails,
    getCryptoCharts,
    getCryptoChartsYearly
} = require("../controllers/crytoControllers")
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

// GET Crypto List
router.get('/cryptoList', getCryptoList)

// POST Crypto Details
router.post('/cryptoDetail', getCryptoDetails)

// POST Crypto Charts
router.post('/cryptoChart', getCryptoCharts)

// POST Crypto Charts Yearly
router.post('/cryptoChartYearly', getCryptoChartsYearly)



module.exports = router