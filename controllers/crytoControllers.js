const { queryDb }= require("../db_config/db")

const getCryptoList = async (req, res) => {

    // insert into (userid, username, email, password) values ('1', )
    let query = {
        text: "select * from cryptown.users where userid=$1",
        values: ["1"]
      }
    let result = await queryDb(query)

    // send a json response
    res.json({mssg: "GET Cryto Lists from docker", result: result})
}


module.exports = {
    getCryptoList
}