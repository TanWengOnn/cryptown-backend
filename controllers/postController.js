const { queryDb }= require("../db_config/db")
const validator = require("validator")
const { v4: uuidv4 } = require('uuid');

const getPost = async (req, res) => {
    const userId = req.userId

    let result = await getPosts_2(userId)
    let posts = result["getPost"]
    let subPosts = result["getSubPost"]
    let postsObj={};
    for(const post of posts){
        postsObj[post.postid]=post;
        post["replies"]=[]
    }
    
    for(const subpost of subPosts){
        postsObj[subpost["postid"]]["replies"].push(subpost);
    }

    // send a json response
    res.json({mssg: "GET posts from docker", postsObj})
}

const addPosts = async (req, res) => {
    const userId = req.userId
    let { post, dateTime } = req.body 
    try {
        await addPost(userId, post, dateTime)
        // send a json response
        res.status(200).json({mssg: "Add posts from docker"})
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to Add Post",
            error: error.message
        })
    }    
}

const addSubPosts = async (req, res) => {
    const userId = req.userId
    let { postId, post, dateTime } = req.body 
    try {
        await addSubPost(userId, postId, post, dateTime)
        // send a json response
        res.status(200).json({mssg: "Add sub post from docker"})
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to add sub post",
            error: error.message
        })
    }    
}

// const getPosts = async function(userId) {
//     let escaped_userId = validator.escape(userId)

//     let checkUser = {
//         text: "select * from cryptown.users where userid=$1",
//         values: [escaped_userId]
//     }

//     let user = await queryDb(checkUser)

//     if (user["result"].length === 0) {
//         throw Error('User does not exist')
//     }

//     let getPost = {
//         text: 
//         `with subposts as 
//         (select * from cryptown.subposts)
//         , posts as 
//             (select 
//                 p.userid as userid
//                 , sp.userid as subpostuserid
//                 , sp.postid as postid
//                 , p.postid as postid_1
//                 , p.post as post
//                 , sp.subpost as subpost
//             from subposts as sp 
//                 left join 
//             cryptown.posts as p 
//                 on sp.postid=p.postid)
//         select 
//             p.userid
//             , users.email
//             , p.subpostuserid
//             , p.postid
//             , p.postid_1
//             , p.post
//             , p.subpost 
//         from posts as p 
//             left join 
//         cryptown.users as users
//             on p.userid=users.userid;`,
//         // values: [postId, escaped_userId, escaped_post, escaped_dateTime,server_datetime]
//     }

//     let getQuery = await queryDb(getPost)

//     if (getQuery["error"] !== undefined) {
//         throw Error("Failed to get post")
//     }
    
//     return getQuery["result"]

// }

const getPosts_2 = async function(userId) {
    let escaped_userId = validator.escape(userId)

    let checkUser = {
        text: "select * from cryptown.users where userid=$1",
        values: [escaped_userId]
    }

    let user = await queryDb(checkUser)

    if (user["result"].length === 0) {
        throw Error('User does not exist')
    }

    let getPostQuery = {
        text: 
        `select posts.postid, posts.post, posts.postdatetime, users.email from cryptown.posts as posts left join cryptown.users as users on posts.userid=users.userid;`,
        // values: [postId, escaped_userId, escaped_post, escaped_dateTime,server_datetime]
    }

    let getPost = await queryDb(getPostQuery)

    if (getPost["error"] !== undefined) {
        throw Error("Failed to get post")
    }

    let getSubPostQuery = {
        text: 
        `select subposts.subpostid, subposts.postid, subposts.subpost, subposts.subpostdatetime, users.email from cryptown.subposts as subposts left join cryptown.users as users on subposts.userid=users.userid;`,
        // values: [postId, escaped_userId, escaped_post, escaped_dateTime,server_datetime]
    }

    let getSubPost = await queryDb(getSubPostQuery)

    if (getSubPost["error"] !== undefined) {
        throw Error("Failed to get sub post")
    }
    
    return {getPost: getPost["result"], getSubPost: getSubPost["result"]}

}


const addPost = async function(userId, post, dateTime) {
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
        throw Error("Failed to add post")
    }
    
    return true

}


const addSubPost = async function(userId, postId, post, dateTime) {
    //***** Add client side datetime *****//
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
        throw Error('User does not exist')
    }

    // check if the main post exists
    let checkMainPost = {
        text: "select * from cryptown.posts where postid=$1",
        values: [escaped_postId]
    }

    let mainPost = await queryDb(checkMainPost)

    if (mainPost["result"].length === 0) {
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
        throw Error("Failed to add sub post db")
    }
    
    return true

}



module.exports = {
    getPost,
    addPosts,
    addSubPosts
}