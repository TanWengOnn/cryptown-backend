const express = require("express")
const {
    getUserCount,
} = require("../controllers/miscControllers")
const { publicCache } = require('../middleware/responseHeader')


const router = express.Router()


router.use(publicCache);

// GET Registered and Active User Count
router.get('/userCount', getUserCount)


module.exports = router