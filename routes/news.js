const express = require("express")
const {
    getNewsList
} = require("../controllers/newsController")
const requireAuth = require('../middleware/requireAuth')
const { publicCache } = require('../middleware/responseHeader')


const router = express.Router()

router.use(publicCache)

// GET Exchange List
router.get('/', getNewsList)


module.exports = router