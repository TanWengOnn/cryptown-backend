const express = require("express")
const {
    getCryptoList,
    getCryptoDetails,
    getCryptoCharts,
    getCryptoChartsMax
} = require("../controllers/crytoControllers")
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// router.use(requireAuth)

// GET Crypto List
router.get('/cryptoList', getCryptoList)

// POST Crypto Details
router.post('/cryptoDetail', getCryptoDetails)

// POST Crypto Charts
router.post('/cryptoChart', getCryptoCharts)

// POST Crypto Charts Max
router.post('/cryptoChartMax', getCryptoChartsMax)



module.exports = router