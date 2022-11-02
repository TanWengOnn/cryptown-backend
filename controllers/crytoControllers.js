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
        let cryptoList = await getCrypto()
        // send a json response
        res.status(200).json({mssg: "GET Cryto Lists", cryptoList})
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to fetch crypto list",
            error: error.message
        })
    }
}

// Get Crypto Details
const getCryptoDetails = async (req, res) => {
    const { cryptoId } = req.body
    console.log("CRYPTO:", cryptoId)
    try {
        let cryptoDetails = await getCryptoDetail(cryptoId)
        // send a json response
        res.status(200).json({mssg: "POST Cryto Detail", cryptoDetails})
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to fetch crypto details",
            error: error.message
        })
    }
    
}

const getCryptoChartsDaily = async (req, res) => {
    const { cryptoId } = req.body

    try {
        let cryptoChart = await getCryptoChartDaily(cryptoId)
        // send a json response
        res.status(200).json({mssg: "POST Cryto daily chart", cryptoChart})
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to fetch crypto daily chart",
            error: error.message
        })
    }

}

const getCryptoChartsWeekly = async (req, res) => {
    const { cryptoId } = req.body

    try {
        let cryptoChart = await getCryptoChartWeekly(cryptoId)
        // send a json response
        res.status(200).json({mssg: "POST Cryto weekly chart", cryptoChart})
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to fetch crypto weekly chart",
            error: error.message
        })
    }

}

const getCryptoChartsMax = async (req, res) => {
    const { cryptoId } = req.body

    try {
        let cryptoChart = await getCryptoChartMax(cryptoId)
        // send a json response
        res.status(200).json({mssg: "POST Cryto Max chart", cryptoChart})
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to fetch crypto Max chart",
            error: error.message
        })
    }
    
}

// Get Crypto Trending
const getCryptoTrending = async (req, res) => {

    try {
        let cryptoTrending = await getTrendingCrypto()
        // send a json response
        res.status(200).json({mssg: "GET Cryto Trending", cryptoTrending})
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to fetch crypto trending",
            error: error.message
        })
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