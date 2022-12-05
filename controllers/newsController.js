const logger = require("../logger/loggerConfig")
const { getBingNews } = require("./functions/newsFunctions")

const getNewsList = async (req, res) => {
    
    try {
        let news = await getBingNews(req)

        res.status(200).json({mssg: "GET News Lists successful", news})
        logger.info({ label:'News API', message: 'Get news lists', outcome:'success', ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to get news list", 
            error: error.message
        })
        logger.error({ label:'News API', message: 'Get news lists', outcome:'failed', ipAddress: req.ip, error: error.message })
    } 
    
}


module.exports = {
    getNewsList
}