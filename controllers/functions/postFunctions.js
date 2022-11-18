const { queryDb }= require("../../db_config/db")
const validator = require("validator")
const { v4: uuidv4 } = require('uuid');

const getPosts = async function(userId, req) {
    let escaped_userId = validator.escape(userId)

    let checkUser = {
        text: "select * from cryptown.users where userid=$1",
        values: [escaped_userId]
    }

    let user = await queryDb(checkUser)

    if (user["result"].length === 0) {
        // logger.warn({ label:'Posts API', message: 'User does not exist', outcome:'failed', user: escaped_userId, ipAddress: req.ip})
        throw Error('User does not exist')
    }

    let getPostQuery = {
        text: 
        `select posts.postid, posts.post, posts.postdatetime, users.email, users.username from cryptown.posts as posts left join cryptown.users as users on posts.userid=users.userid;`,
        // values: [postId, escaped_userId, escaped_post, escaped_dateTime,server_datetime]
    }

    let getPost = await queryDb(getPostQuery)

    if (getPost["error"] !== undefined) {
        // logger.warn({ label:'Posts API', message: 'Get all post - Failed to get main post', outcome:'failed', user: escaped_userId, ipAddress: req.ip})
        throw Error("Failed to get post")
    }

    let getSubPostQuery = {
        text: 
        `select subposts.subpostid, subposts.postid, subposts.subpost, subposts.subpostdatetime, users.email, users.username from cryptown.subposts as subposts left join cryptown.users as users on subposts.userid=users.userid;`,
        // values: [postId, escaped_userId, escaped_post, escaped_dateTime,server_datetime]
    }

    let getSubPost = await queryDb(getSubPostQuery)

    if (getSubPost["error"] !== undefined) {
        // logger.warn({ label:'Posts API', message: 'Get all post - Failed to get sub post', outcome:'failed', user: escaped_userId, ipAddress: req.ip})
        throw Error("Failed to get sub post")
    }

    // logger.http({ label:'Posts API', message: 'Get all post', outcome:'success', user: escaped_userId, ipAddress: req.ip })
    return {getPost: getPost["result"], getSubPost: getSubPost["result"]}

}


const addPost = async function(userId, post, dateTime, req) {
    let escaped_userId = validator.escape(userId)
    let escaped_post = validator.escape(post)
    let escaped_dateTime = validator.escape(dateTime)
    let server_datetime = new Date();
    let postId = uuidv4()

    let checkUser = {
        text: "select * from cryptown.users where userid=$1",
        values: [escaped_userId]
    }

    let user = await queryDb(checkUser)

    if (user["result"].length === 0) {
        // logger.warn({ label:'Posts API', message: 'User does not exist', outcome:'failed', user: escaped_userId, ipAddress: req.ip})
        throw Error('User does not exist')
    }

    let addPost = {
        text: 
        `insert into cryptown.posts 
            (postid, userid, post, postdatetime, serverdatetime) 
            values 
            ($1, $2, $3, $4::timestamp, $5::timestamp);`,
        values: [postId, escaped_userId, escaped_post, escaped_dateTime,server_datetime]
    }

    let postQuery = await queryDb(addPost)

    if (postQuery["error"] !== undefined) {
        // logger.warn({ label:'Posts API', message: `Add main post - Failed to add main post - ${postId}`, outcome:'failed', user: escaped_userId, ipAddress: req.ip})
        throw Error("Failed to add post")
    }

    let getNewPostQuery = {
        text: `
        select posts.postid, posts.post, posts.postdatetime, users.email, users.username 
            from cryptown.posts as posts 
        left join cryptown.users as users 
            on posts.userid=users.userid 
        where posts.userid=$1 and posts.postid=$2;
        `,
        values: [escaped_userId, postId]
    }

    let getNewPost = await queryDb(getNewPostQuery)

    if (getNewPost["error"] !== undefined) {
        // logger.warn({ label:'Posts API', message: `Add main post - get newly added posts - ${postId}`, outcome:'failed', user: escaped_userId, ipAddress: req.ip})
        throw Error("Failed to get new post")
    }

    getNewPost["result"][0]["replies"] = []
    
    // logger.http({ label:'Posts API', message: `Add main post - ${postId}`, outcome:'success', user: escaped_userId, ipAddress: req.ip })
    return getNewPost["result"]

}


const addSubPost = async function(userId, postId, post, dateTime, req) {
    let escaped_userId = validator.escape(userId)
    let escaped_post = validator.escape(post)
    let escaped_postId = validator.escape(postId)
    let escaped_dataTime = validator.escape(dateTime)
    let server_datetime = new Date();
    let subPostId = uuidv4()

    // check if that user exists 
    let checkUser = {
        text: "select * from cryptown.users where userid=$1",
        values: [escaped_userId]
    }

    let user = await queryDb(checkUser)

    if (user["result"].length === 0) {
        // logger.warn({ label:'Posts API', message: 'Add sub post - User does not exist', outcome:'failed', user: escaped_userId, ipAddress: req.ip})
        throw Error('User does not exist')
    }

    // check if the main post exists
    let checkMainPost = {
        text: "select * from cryptown.posts where postid=$1",
        values: [escaped_postId]
    }

    let mainPost = await queryDb(checkMainPost)

    if (mainPost["result"].length === 0) {
        // logger.warn({ label:'Posts API', message: `Add sub post - main post does not exist - ${escaped_postId}`, outcome:'failed', user: escaped_userId, ipAddress: req.ip })
        throw Error('Post does not exist')
    }

    let addPost = {
        text: 
        `insert into cryptown.subposts 
            (subpostid, postid, userid, subpost, subpostdatetime, serverdatetime) 
            values 
            ($1, $2, $3, $4, $5::timestamp, $6::timestamp);`,
        values: [subPostId, escaped_postId, escaped_userId, escaped_post, escaped_dataTime, server_datetime]
    }

    let postQuery = await queryDb(addPost)

    if (postQuery["error"] !== undefined) {
        // logger.warn({ label:'Posts API', message: `Add sub post - Failed to add sub post db - ${escaped_postId}`, outcome:'failed', user: escaped_userId, ipAddress: req.ip })
        throw Error("Failed to add sub post db")
    }
    
    // logger.http({ label:'Posts API', message: `Add sub post - ${escaped_postId}`, outcome:'success', user: escaped_userId, ipAddress: req.ip })
    return true

}

module.exports = {
    getPosts,
    addPost,
    addSubPost
}