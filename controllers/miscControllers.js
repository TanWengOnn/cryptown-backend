const { queryDb }= require("../db_config/db")

const getUserCount = async (req, res) => {
    try {

        let registeredUsers = {
            text: "select username from cryptown.users;",
          }
    
        let userCount = await queryDb(registeredUsers)

        let activeUsers = {
            text: "select jwtid from cryptown.jwt;",
          }
    
        let activeUserCount = await queryDb(activeUsers)
        
        // send a json response
        res.status(200).json({
            mssg: "Get Registered Users Successful",
            userCount: userCount["result"].length, 
            activeUserCount: activeUserCount["result"].length
        })
        // logger.info({ label:'User API', message: `${user["userid"]} logged in`, outcome:'success', userId: user["userid"], ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Get Registered Users Failed",
            error: error.message
        })  
        // logger.error({ label:'User API', message: `${user["userid"]} login failed`, outcome:'failed', userId: user["userid"], ipAddress: req.ip, error: error.message })
    }
}

module.exports = {
    getUserCount,
}