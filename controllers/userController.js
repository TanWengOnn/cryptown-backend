const { queryDb }= require("../db_config/db")
const jwt = require("jsonwebtoken")
const { login, signup, profile, updateProfile } = require("./functions/userFunctions")
const fs   = require('fs');
const path = require("path");

const privateKEY  = fs.readFileSync(path.resolve(__dirname, "../jwt-self-sign-certs/key.pem"), 'utf8');

const createToken = (userId) => {
                //    payload   secret              expiration time
    return jwt.sign({userId}, privateKEY, { expiresIn: '1d', algorithm:  "RS256" })
}

// Get Crypto List
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        let user = await login(email, password)

        let userJwt = createToken(user["userid"])

        // send a json response
        res.status(200).json({
            mssg: "Logged In Successful", 
            email,
            userJwt,
        })

    } catch (error) {
        res.status(400).json({
            mssg: "Login Failed",
            error: error.message
        })  
    }
}

const signupUser = async (req, res) => {
    const { email, username, password, confirm_password } = req.body

    try {
        await signup(email, username, password, confirm_password)

        let query = {
            text: "select * from cryptown.users where email=$1;",
            values: [email]
        }

        let output = await queryDb(query)

        userId = output["result"][0]["userid"]

        let userJwt = createToken(userId)

        // send a json response
        res.status(200).json({
            mssg: "Sign Up Successful", 
            email, 
            userJwt,
            // bottom keys are for testing purposes 
            username, 
            password, 
            confirm_password,
            userId
            
        })
    } catch (error) {
        res.status(400).json({
            mssg: "Sign Up Failed",
            error: error.message
        })   
    }

    
}


const profileUser = async (req, res) => { 
    const userId  = req.userId

    try {
        let user = await profile(userId)
    
        // send a json response
        res.status(200).json({
            mssg: "Get Profile Successful", 
            userId,
            email: user["email"],
            username: user["username"]
        })
    } catch (error) {
        res.status(400).json({
            mssg: "Get Profile Failed", 
            error: error.message
        })
    }

}


const updateUser = async (req, res) => { 
    const userId = req.userId
    const { username, password, confirm_password } = req.body

    try {
        let user = await updateProfile(userId, username, password, confirm_password)
        // send a json response
        res.status(200).json({
            mssg: "Update Profile Successful", 
            userId,
            email: user["email"],
            username: user["username"],
            // remove the bottom key,it is for testing only 
            user
        })
    } catch (error) {
        res.status(400).json({
            mssg: "Update Profile Failed", 
            error: error.message
        })
    }
}



module.exports = {
    loginUser,
    signupUser,
    profileUser,
    updateUser
}