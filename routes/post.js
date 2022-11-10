const express = require("express")
const {
    getPost,
    addPosts,
    addSubPosts
} = require("../controllers/postController")
const requireAuth = require('../middleware/requireAuth')
const { privateCache } = require('../middleware/responseHeader')

const router = express.Router()

router.use(requireAuth)

router.use(privateCache)

// GET posts
router.get('/getPosts', getPost)

// POST new posts
router.post('/addPost', addPosts)

// POST new sub posts 
router.post('/addSubPost', addSubPosts)





module.exports = router