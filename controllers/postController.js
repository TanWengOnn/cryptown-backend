const {
    getPosts,
    addPost,
    addSubPost
} = require("./functions/postFunctions")

const getPost = async (req, res) => {
    const userId = req.userId

    try {
        let result = await getPosts(userId)
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
        res.status(200).json({mssg: "GET posts from docker", postsObj})
    } catch (error) {
        res.status(400).json({
            mssg: "Failed to get Post",
            error: error.message
        })
    }
   
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




module.exports = {
    getPost,
    addPosts,
    addSubPosts
}