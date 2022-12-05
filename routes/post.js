const express = require("express")
const {
    getPost,
    addPosts,
    addSubPosts,
    getUserPost,
    postDelete
} = require("../controllers/postController")
const requireAuth = require('../middleware/requireAuth')
const { privateCache } = require('../middleware/responseHeader')

const router = express.Router()

// Require authentication 
router.use(requireAuth)

// cloudflare caching
router.use(privateCache)

// GET posts
router.get('/getPosts', getPost)

// POST new posts
router.post('/addPost', addPosts)

// POST new sub posts 
router.post('/addSubPost', addSubPosts)

// GET user posts
router.get('/getUserPosts', getUserPost)

// DELETE user posts
router.delete('/post-delete', postDelete)






module.exports = router