const { getBingNews } = require("./functions/newsFunctions")

const getNewsList = async (req, res) => {
    
    try {
        let news = await getBingNews()
        // send a json response
        res.status(200).json({mssg: "GET News Lists successful", news})
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to get news list", 
            error: error.message
        })
    } 
    
}


module.exports = {
    getNewsList
}