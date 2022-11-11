const logger = require("../logger/loggerConfig")
const {
    getCrypto,
    getCryptoDetail,
    getCryptoChartDaily,
    getCryptoChartMax,
    getCryptoChartWeekly,
    getTrendingCrypto
} = require("./functions/cryptoFunctions")

// Get Crypto List
const getCryptoList = async (req, res) => {

    try {
        let cryptoList = await getCrypto(req)
        // send a json response
        res.status(200).json({mssg: "GET Cryto Lists", cryptoList})
        logger.info({ label:'Crypto API', message: 'Get crypto lists', outcome:'success', ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to fetch crypto list",
            error: error.message
        })
        logger.error({ label:'Crypto API', message: 'Get crypto lists', outcome:'failed', ipAddress: req.ip, error: error.message })
    }
}

// Get Crypto Details
const getCryptoDetails = async (req, res) => {
    const { cryptoId } = req.body
    console.log("CRYPTO:", cryptoId)
    try {
        let cryptoDetails = await getCryptoDetail(cryptoId, req)
        // send a json response
        res.status(200).json({mssg: "POST Cryto Detail", cryptoDetails})
        logger.info({ label:'Crypto API', message: 'Get crypto details', outcome:'success', ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to fetch crypto details",
            error: error.message
        })
        logger.error({ label:'Crypto API', message: 'Get crypto details', outcome:'failed', ipAddress: req.ip, error: error.message })
    }
    
}

const getCryptoChartsDaily = async (req, res) => {
    const { cryptoId } = req.body

    try {
        let cryptoChart = await getCryptoChartDaily(cryptoId, req)
        // send a json response
        res.status(200).json({mssg: "POST Cryto daily chart", cryptoChart})
        logger.info({ label:'Crypto API', message: 'Get crypto daily chart', outcome:'success', ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to fetch crypto daily chart",
            error: error.message
        })
        logger.error({ label:'Crypto API', message: 'Get crypto daily chart', outcome:'failed', ipAddress: req.ip, error: error.message })
    }

}

const getCryptoChartsWeekly = async (req, res) => {
    const { cryptoId } = req.body

    try {
        let cryptoChart = await getCryptoChartWeekly(cryptoId, req)
        // send a json response
        res.status(200).json({mssg: "POST Cryto weekly chart", cryptoChart})
        logger.info({ label:'Crypto API', message: 'Get crypto weekly chart', outcome:'success', ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to fetch crypto weekly chart",
            error: error.message
        })
        logger.error({ label:'Crypto API', message: 'Get crypto weekly chart', outcome:'failed', ipAddress: req.ip, error: error.message })
    }

}

const getCryptoChartsMax = async (req, res) => {
    const { cryptoId } = req.body

    try {
        let cryptoChart = await getCryptoChartMax(cryptoId, req)
        // send a json response
        res.status(200).json({mssg: "POST Cryto Max chart", cryptoChart})
        logger.info({ label:'Crypto API', message: 'Get crypto max chart', outcome:'success', ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to fetch crypto Max chart",
            error: error.message
        })
        logger.error({ label:'Crypto API', message: 'Get crypto max chart', outcome:'failed', ipAddress: req.ip, error: error.message })
    }
    
}

// Get Crypto Trending
const getCryptoTrending = async (req, res) => {

    try {
        let cryptoTrending = await getTrendingCrypto(req)
        // send a json response
        res.status(200).json({mssg: "GET Cryto Trending", cryptoTrending})
        logger.info({ label:'Crypto API', message: 'Get crypto trending', outcome:'success', ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to fetch crypto trending",
            error: error.message
        })
        logger.error({ label:'Crypto API', message: 'Get crypto trending', outcome:'failed', ipAddress: req.ip, error: error.message })
    }
}


module.exports = {
    getCryptoList,
    getCryptoDetails,
    getCryptoChartsDaily,
    getCryptoChartsMax,
    getCryptoChartsWeekly,
    getCryptoTrending
}