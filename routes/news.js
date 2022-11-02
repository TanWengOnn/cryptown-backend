const express = require("express")
const {
    getNewsList
} = require("../controllers/newsController")
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// router.use(requireAuth)

// GET Exchange List
router.get('/', getNewsList)


module.exports = router