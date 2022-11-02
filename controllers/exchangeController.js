const { getExchange } = require("./functions/exchangeFunctions")

const getExchangeList = async (req, res) => {
    
    try {
        let exchange = await getExchange()
        // send a json response
        res.status(200).json({mssg: "Succesfully to fetch exchanged list", exchange})
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to fetch exchanged list",
            error: error.message
        })
    }
    
}


module.exports = {
    getExchangeList
}