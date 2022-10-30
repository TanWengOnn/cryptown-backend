const express = require("express")
const {
    loginUser,
    signupUser,
    profileUser,
    updateUser,
} = require("../controllers/userController")
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// login route
router.post('/login', loginUser)

// sign up route
router.post('/signup', signupUser)

// Require authentication 
router.use(requireAuth)

// View profile info 
router.get('/profile', profileUser)

// Update profile info 
router.patch('/update', updateUser)




module.exports = router