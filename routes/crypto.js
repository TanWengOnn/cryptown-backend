const express = require("express")
const {
    getCryptoList,
    getCryptoDetails,
    getCryptoChartsDaily,
    getCryptoChartsWeekly,
    getCryptoChartsMax,
    getCryptoTrending
} = require("../controllers/crytoControllers")
const requireAuth = require('../middleware/requireAuth')
const { publicCache } = require('../middleware/responseHeader')


const router = express.Router()

// router.use(requireAuth)

router.use(publicCache);

// GET Crypto List
router.get('/cryptoList', getCryptoList)

// POST Crypto Details
router.post('/cryptoDetail', getCryptoDetails)

// POST Crypto Charts Dailt
router.post('/cryptoChartDaily', getCryptoChartsDaily)

// POST Crypto Charts Weekly
router.post('/cryptoChartWeekly', getCryptoChartsWeekly)

// POST Crypto Charts Yearly
router.post('/cryptoChartMax', getCryptoChartsMax)

// GET Crypto Trending
router.get('/cryptoTrending', getCryptoTrending)



module.exports = router