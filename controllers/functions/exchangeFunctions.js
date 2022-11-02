const axios = require("axios")

const getExchange = async () => {
    let results = await axios.get("https://api.coingecko.com/api/v3/exchanges?per_page=20")

    let arr = []

    results["data"].forEach((data) => {
        let obj = {}
        obj["name"] = data["name"]
        obj["year_established"] = data["year_established"]
        obj["country"] = data["country"]
        obj["trust_score_rank"] = data["trust_score_rank"]
        obj["trust_score"] = data["trust_score"]
        obj["trade_volume_24h_btc"] = data["trade_volume_24h_btc"]
        obj["url"] = data["url"]
        obj["image"] = data["image"]
    
        arr.push(obj)
    })    
    return arr
}

module.exports = {
    getExchange
}