const axios = require("axios")
const logger = require("../../logger/loggerConfig")

const getBingNews = async (req) => {
    try {
        let results = await axios.get("https://bing-news-search1.p.rapidapi.com/news/search", {
        params: {q: 'cryptocurrency', count: '16', freshness: 'Day', textFormat: 'Raw', safeSearch: 'Off'},
        headers: {
            'X-BingApis-SDK': 'true',
            'X-RapidAPI-Key': process.env.BING_NEWS_TOKEN,
            'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
        }
        })

        let articleArr = results["data"]["value"]

        let arr = []

        articleArr.forEach((data) => {
            let obj = {}
            obj["name"] = data["name"]
            obj["url"] = data["url"]
            obj["description"] = data["description"]
            obj["datePublished"] = data["datePublished"]
            if ("image" in data) {
                obj["image"] = data["image"]["thumbnail"]["contentUrl"]
            }
        
            arr.push(obj)
        })

        logger.http({ label:'Bing News API', message: 'Get Bing news lists', outcome:'success', ipAddress: req.ip })
        return arr
    } catch (error) {
        logger.error({ label:'Bing News API', message: 'Get Bing news lists', outcome:'failed', ipAddress: req.ip, error: error.message })
        throw Error(error.message)
    }
}

module.exports = {
    getBingNews
}