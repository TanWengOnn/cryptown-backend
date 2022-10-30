const express = require("express")
const {
    getPost,
} = require("../controllers/postController")

const router = express.Router()

// GET Exchange List
router.get('/', getPost)



module.exports = router