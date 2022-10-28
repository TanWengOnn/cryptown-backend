const { queryDb }= require("../db_config/db")

const getExchangeList = async (req, res) => {
    let query = {
        text: 'select * from cryptown.users',
      }
    let result = await queryDb(query)

    // send a json response
    res.json({mssg: "GET Exchange Lists from docker", result: result})
}


module.exports = {
    getExchangeList
}