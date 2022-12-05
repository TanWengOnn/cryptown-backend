const express = require("express")
const {
    getCryptoList,
    getCryptoDetails,
    getCryptoChartsDaily,
    getCryptoChartsWeekly,
    getCryptoChartsMax,
    getCryptoTrending
} = require("../controllers/crytoControllers")
const { publicCache } = require('../middleware/responseHeader')


const router = express.Router()

// cloudflare caching
router.use(publicCache);

// GET Crypto List
router.get('/cryptoList', getCryptoList)

// POST Crypto Details
router.get('/cryptoDetail/:cryptoId', getCryptoDetails)

// POST Crypto Charts Dailt
router.get('/cryptoChartDaily/:cryptoId', getCryptoChartsDaily)

// POST Crypto Charts Weekly
router.get('/cryptoChartWeekly/:cryptoId', getCryptoChartsWeekly)

// POST Crypto Charts Yearly
router.get('/cryptoChartMax/:cryptoId', getCryptoChartsMax)

// GET Crypto Trending
router.get('/cryptoTrending', getCryptoTrending)



module.exports = router