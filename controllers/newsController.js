const { queryDb }= require("../db_config/db")

const getNewsList = async (req, res) => {
    let query = {
        text: 'select * from cryptown.users',
      }
    let result = await queryDb(query)

    // send a json response
    res.json({mssg: "GET News Lists from docker", result: result})
}


module.exports = {
    getNewsList
}