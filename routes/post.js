const express = require("express")
const {
    getPost,
    addPosts
} = require("../controllers/postController")
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

// GET posts
router.get('/getPosts', getPost)

// POST new posts
router.post('/addPost', addPosts)




module.exports = router