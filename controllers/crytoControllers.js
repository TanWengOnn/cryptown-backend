const { queryDb }= require("../db_config/db")

// Get Crypto List
const getCryptoList = async (req, res) => {

    // insert into (userid, username, email, password) values ('1', )
    let query = {
        text: "select * from cryptown.users where userid=$1",
        values: ["1"]
      }
    let result = await queryDb(query)

    // send a json response
    res.status(200).json({mssg: "GET Cryto Lists from docker", result: result})
}

// Get Crypto Details
const getCryptoDetails = async (req, res) => {
    const { cryptoId } = req.body
    
    // send a json response
    res.status(200).json({mssg: "POST Cryto Detail from docker", result: cryptoId})
}


module.exports = {
    getCryptoList,
    getCryptoDetails
}