const axios = require("axios")

const getBingNews = async () => {
    try {
        let results = await axios.get("https://bing-news-search1.p.rapidapi.com/news/search", {
        params: {q: 'cryptocurrency', count: '16', freshness: 'Day', textFormat: 'Raw', safeSearch: 'Off'},
        headers: {
            'X-BingApis-SDK': 'true',
            'X-RapidAPI-Key': 'dc2e7b7a61mshc0cca24ec5733ffp1f5bc6jsn4348c7cec194',
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

        console.log(arr)
        return arr
    } catch (error) {
        throw Error(error.message)
    }
}

module.exports = {
    getBingNews
}