const { queryDb }= require("../db_config/db")

// Get Crypto List
const loginUser = async (req, res) => {
    const { email, password } = req.body


    // insert into (userid, username, email, password) values ('1', )
    let query = {
        text: "select * from cryptown.users where userid=$1",
        values: ["1"]
      }
    let result = await queryDb(query)
    

    // send a json response
    res.status(200).json({mssg: "POST login from docker", result: {
        result,
        email,
        password
    }})
}

const signupUser = async (req, res) => {
    const { email, username, password, confirm_password } = req.body

    // send a json response
    res.status(200).json({mssg: "POST signup from docker", result: {
        email, 
        username, 
        password, 
        confirm_password
    }})
}


module.exports = {
    loginUser,
    signupUser
}