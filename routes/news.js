const express = require("express")
const {
    getNewsList
} = require("../controllers/newsController")

const router = express.Router()

// GET Exchange List
router.get('/', getNewsList)


module.exports = router