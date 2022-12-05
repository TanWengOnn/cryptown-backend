const express = require("express")
const {
    getNewsList
} = require("../controllers/newsController")
const { publicCache } = require('../middleware/responseHeader')

const router = express.Router()

// cloudflare caching
router.use(publicCache)

// GET Exchange List
router.get('/', getNewsList)


module.exports = router