const express = require("express")
const {
    loginUser,
    signupUser,
    profileUser,
    updateUser,
} = require("../controllers/userController")
const requireAuth = require('../middleware/requireAuth')
const { privateCache, noStoreCache } = require('../middleware/responseHeader')

const router = express.Router()

router.use(noStoreCache)

// login route
router.post('/login', loginUser)

// sign up route
router.post('/signup', signupUser)

// Require authentication 
router.use(requireAuth)

router.use(privateCache)

// View profile info 
router.get('/profile', profileUser)

// Update profile info 
router.patch('/update', updateUser)




module.exports = router