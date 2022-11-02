const { queryDb }= require("../db_config/db")
const validator = require("validator")
const { v4: uuidv4 } = require('uuid');

const getPost = async (req, res) => {
    let query = {
        text: 'select * from cryptown.users',
      }
    let result = await queryDb(query)

    // send a json response
    res.json({mssg: "GET posts from docker", result: result})
}

const addPosts = async (req, res) => {
    const userId = req.userId
    let { post } = req.body 
    try {
        await addPost(userId, post)
        // send a json response
        res.status(200).json({mssg: "Add posts from docker"})
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to fetch crypto list",
            error: error.message
        })
    }    
}


const addPost = async function(userId, post) {
    //***** Add client side datetime *****//
    let escaped_userId = validator.escape(userId)
    let escaped_post = validator.escape(post)
    let server_datetime = new Date();
    let postId = uuidv4()

    let checkUser = {
        text: "select * from cryptown.users where userid=$1",
        values: [escaped_userId]
    }

    let user = await queryDb(checkUser)

    if (user["result"].length === 0) {
        throw Error('User does not exist')
    }

    let addPost = {
        text: 
        `insert into cryptown.posts 
            (postid, userid, post, postdatetime) 
            values 
            ($1, $2, $3, $4::timestamp);`,
        values: [postId, escaped_userId, escaped_post, server_datetime]
    }

    let postQuery = await queryDb(addPost)

    if (postQuery["error"] !== undefined) {
        throw Error("Failed to add to favourite")
    }
    
    return true

}


module.exports = {
    getPost,
    addPosts
}