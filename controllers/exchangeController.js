const logger = require("../logger/loggerConfig")
const { getExchange } = require("./functions/exchangeFunctions")

const getExchangeList = async (req, res) => {
    
    try {
        let exchange = await getExchange(req)
        // send a json response
        res.status(200).json({mssg: "Succesfully to fetch exchanged list", exchange})
        logger.info({ label:'Exchange API', message: 'Get exchange lists', outcome:'success', ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to fetch exchanged list",
            error: error.message
        })
        logger.error({ label:'Exchange API', message: 'Get exchange lists', outcome:'failed', ipAddress: req.ip, error: error.message })
    }
    
}


module.exports = {
    getExchangeList
}