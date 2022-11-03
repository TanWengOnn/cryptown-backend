const express = require("express")
const {
    getPost,
    addPosts,
    addSubPosts
} = require("../controllers/postController")
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

// GET posts
router.get('/getPosts', getPost)

// POST new posts
router.post('/addPost', addPosts)

// POST new sub posts 
router.post('/addSubPost', addSubPosts)





module.exports = router