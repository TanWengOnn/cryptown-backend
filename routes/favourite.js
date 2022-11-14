const express = require("express")
const {
    favouriteList,
    favouriteAdd,
    favouriteDelete
} = require("../controllers/favouriteController")
const requireAuth = require('../middleware/requireAuth')
const { noStoreCache } = require('../middleware/responseHeader')

const router = express.Router()

// Require authentication 
router.use(requireAuth)

// cloudflare caching
// router.use(privateCache)
router.use(noStoreCache)

// Get user favourite list
router.get('/favourite-list', favouriteList)

router.post('/favourite-add', favouriteAdd)

router.delete('/favourite-delete', favouriteDelete)




module.exports = router