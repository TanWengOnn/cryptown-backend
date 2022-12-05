const { queryDb }= require("../db_config/db")
const logger = require("../logger/loggerConfig")

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

        let posts = {
            text: "select postid from cryptown.posts;",
          }
    
        let postsCount = await queryDb(posts)

        let subPosts = {
            text: "select subpostid from cryptown.subposts;",
          }
    
        let subPostsCount = await queryDb(subPosts)

        let totalPosts = postsCount["result"].length + subPostsCount["result"].length
        
        res.status(200).json({
            mssg: "Get Registered Users Successful",
            userCount: userCount["result"].length, 
            activeUserCount: activeUserCount["result"].length, 
            postsCount: totalPosts
        })
        logger.info({ label:'Miscellaneous API', message: `Get User count`, outcome:'success', ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Get Registered Users Failed",
            error: error.message
        })  
        logger.error({ label:'Miscellaneous API', message: `Failed to get user count`, outcome:'failed', ipAddress: req.ip, error: error.message })
    }
}

module.exports = {
    getUserCount,
}