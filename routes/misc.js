const express = require("express")
const {
    getUserCount,
} = require("../controllers/miscControllers")
const { publicCache } = require('../middleware/responseHeader')


const router = express.Router()

// cloudflare caching
router.use(publicCache);

// GET Registered, Active User and Post Count
router.get('/userCount', getUserCount)


module.exports = router