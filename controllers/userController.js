const { queryDb }= require("../db_config/db")
const jwt = require("jsonwebtoken")
const { login, signup } = require("./authentication/authentication")

const createToken = (userId) => {
                //    payload   secret              expiration time
    return jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: '1d' })
}

// Get Crypto List
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        let user = await login(email, password)

        let userJwt = createToken(user[0]["userid"])

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

module.exports = {
    loginUser,
    signupUser
}