const axios = require("axios")
const validator = require("validator")

const getCrypto = async () => {
    let results = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false")

    let arr = []

    results["data"].forEach((data) => {
        let obj = {}
        obj["cryptoId"] = data["id"]
        obj["symbol"] = data["symbol"]
        obj["name"] = data["name"]
        obj["current_price"] = data["current_price"]
        obj["market_cap"] = data["market_cap"]
        obj["market_cap_rank"] = data["market_cap_rank"]
        obj["image"] = data["image"]


        arr.push(obj)
    })

    return arr
}


const getCryptoDetail = async (cryptoId) => {
    try {
        let escaped_cryptoId = validator.escape(cryptoId)
        let result = await axios.get(`https://api.coingecko.com/api/v3/coins/${escaped_cryptoId}`)


        let data = result["data"]

        let obj = {}
        let ath = {}
        let atl = {}
        obj["symbol"] = data["symbol"]
        obj["name"] = data["name"]
        obj["market_cap_rank"] = data["market_cap_rank"]
        obj["current_price_usd"] = data["market_data"]["current_price"]["usd"]
        obj["current_price_btc"] = data["market_data"]["current_price"]["usd"]
        obj["current_price_myr"] = data["market_data"]["current_price"]["myr"]
        obj["market_cap_usd"] = data["market_data"]["market_cap"]["usd"]
        obj["market_cap_myr"] = data["market_data"]["market_cap"]["myr"]
        obj["total_supply"] = data["market_data"]["total_supply"]
        obj["max_supply"] = data["market_data"]["max_supply"]
        obj["circulating_supply"] = data["market_data"]["circulating_supply"]

        ath["usd"] = data["market_data"]["ath"]["usd"]
        ath["myr"] = data["market_data"]["ath"]["myr"]
        ath["date_usd"] = data["market_data"]["ath_date"]["usd"]
        ath["change_percentage_usd"] = data["market_data"]["ath_change_percentage"]["usd"]
        ath["change_percentage_myr"] = data["market_data"]["ath_change_percentage"]["myr"]
        obj["ath"] = ath

        atl["usd"] = data["market_data"]["atl"]["usd"]
        atl["myr"] = data["market_data"]["atl"]["myr"]
        atl["date_usd"] = data["market_data"]["atl_date"]["usd"]
        atl["change_percentage_usd"] = data["market_data"]["atl_change_percentage"]["usd"]
        atl["change_percentage_myr"] = data["market_data"]["atl_change_percentage"]["myr"]
        obj["atl"] = atl

        let exchange = data["tickers"].slice(0,3)
        let exchangeArr = []
        exchange.forEach((data) => {
            let exchangeObj = {}
            exchangeObj["name"] = data["market"]["name"]
            exchangeObj["trade_url"] = data["trade_url"]
            exchangeArr.push(exchangeObj)
        })

        obj["exchange"] = exchangeArr

        obj["description"] = data["description"]["en"]

        console.log(obj)
        return obj
    } catch (error) {
        throw Error(error.message)
    }
}


const getCryptoChartMax = async (cryptoId) => {
    try {
        let escaped_cryptoId = validator.escape(cryptoId)
        let get_usd_chart = await axios.get(`https://api.coingecko.com/api/v3/coins/${escaped_cryptoId}/market_chart?vs_currency=usd&days=max&interval=daily`)
    
        let usd_chart_arr = get_usd_chart["data"]["prices"]

        let filtered_usd_chart_arr = skipInterval(usd_chart_arr, 183)
        return filtered_usd_chart_arr
    } catch (error) {
        // console.log(error.message)
        throw Error(error.message)
    }
}

const skipInterval = (arr, interval) => {
    let oldArr = arr
    let newArr = []
    let skip = interval

    for (let i = arr.length - 1; i > 0; i-=skip) {
        newArr.push(oldArr[i])
    }
    return newArr
}

const getCryptoChartDaily = async (cryptoId) => {
    try {
        let escaped_cryptoId = validator.escape(cryptoId)
        let get_usd_chart = await axios.get(`https://api.coingecko.com/api/v3/coins/${escaped_cryptoId}/market_chart?vs_currency=usd&days=1&interval=hourly`)
    
        let usd_chart_arr = get_usd_chart["data"]["prices"]

        let objChart = {}
        objChart["get_usd_chart_daily"] = usd_chart_arr
        console.log(objChart)

        return objChart
    } catch (error) {
        throw Error(error.message)
    }

}

const getCryptoChartWeekly = async (cryptoId) => {
    try {
        // let escaped_cryptoId = validator.escape(cryptoId)
        let get_usd_chart = await axios.get(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=myr&days=14&interval=daily`)
    
        let usd_chart_arr = get_usd_chart["data"]["prices"]

        let objChart = {}
        objChart["get_usd_chart_weekly"] = usd_chart_arr
        console.log(objChart)

        return objChart
    } catch (error) {
        throw Error(error.message)
    }

}

const getTrendingCrypto = async () => {
    let results = await axios.get("https://api.coingecko.com/api/v3/search/trending")

    let arr = []

    results["data"]["coins"].forEach((data) => {
        let obj = {}
        obj["cryptoId"] = data["item"]["id"]
        obj["name"] = data["item"]["name"]
        obj["symbol"] = data["item"]["symbol"]
        obj["image"] = data["item"]["large"]
        arr.push(obj)
    })

    
    console.log(arr)
    return arr
}


module.exports = {
    getCrypto,
    getCryptoDetail,
    getCryptoChartMax,
    getCryptoChartDaily,
    getCryptoChartWeekly,
    getTrendingCrypto
}