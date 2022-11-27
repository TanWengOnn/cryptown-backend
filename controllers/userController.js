const { queryDb }= require("../db_config/db")
const jwt = require("jsonwebtoken")
const { login, signup, profile, updateProfile, logout } = require("./functions/userFunctions")
const fs   = require('fs');
const path = require("path");
const logger = require("../logger/loggerConfig")
const { aesEncrypt } = require("../encryption/aesEncryption")
const validator = require("validator")
const { v4: uuidv4 } = require('uuid');


const privateKEY  = fs.readFileSync(path.resolve(__dirname, "../jwt-self-sign-certs/key.pem"), 'utf8');

const createToken = async (userId, req) => {
    // logger.info({ label:'Jwt Token', message: 'Create jwt token', outcome:'success', user: userId, ipAddress: req.ip})
                             //    payload   secret              expiration time
    let createJwt =  jwt.sign({userId}, privateKEY, { expiresIn: '12h', algorithm:  "RS256" })

    let encryptedJwt = aesEncrypt(createJwt, process.env.AES_PASS)

    let addJwt = {
        text: "insert into cryptown.jwt (jwtid, userid, jwt, serverdatetime) values ($1, $2, $3, $4)",
        values: [uuidv4(), userId, createJwt, new Date()]
      }

    let addJwtOutput = await queryDb(addJwt)

    // Error when adding user to database
    if (addJwtOutput["error"] !== undefined) {
        throw Error("Fail to create JWT")
    }

    return encryptedJwt
}

// Get Crypto List
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        let user = await login(email, password, req)

        let userJwt = await createToken(user["userid"], req)

        // send a json response
        res.status(200).json({
            mssg: "Logged In Successful", 
            user: user["username"],
            email,
            userJwt,
        })
        logger.info({ label:'User API', message: `${user["userid"]} logged in`, outcome:'success', userId: user["userid"], ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Login Failed",
            error: error.message
        })  
        logger.error({ label:'User API', message: `${email} login failed`, outcome:'failed', ipAddress: req.ip, error: error.message })
    }
}

const signupUser = async (req, res) => {
    const { email, username, password, confirm_password } = req.body

    try {
        await signup(email, username, password, confirm_password, req)
        
        let escaped_email = validator.escape(email)
        let query = {
            text: "select * from cryptown.users where email=$1;",
            values: [escaped_email]
        }

        let output = await queryDb(query)

        userId = output["result"][0]["userid"]

        let userJwt = await createToken(userId, req)

        // send a json response
        res.status(200).json({
            mssg: "Sign Up Successful", 
            email, 
            username, 
            userJwt,
        })
        logger.info({ label:'User API', message: 'Sign up', outcome:'success', userId: userId, ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Sign Up Failed",
            error: error.message
        })   
        logger.error({ label:'User API', message: `Sign up failed - ${email}`, outcome:'failed', ipAddress: req.ip, error: error.message })
    }

    
}


const profileUser = async (req, res) => { 
    const userId  = req.userId

    try {
        let user = await profile(userId, req)
    
        // send a json response
        res.status(200).json({
            mssg: "Get Profile Successful", 
            email: user["email"],
            username: user["username"]
        })
        logger.info({ label:'User API', message: 'Get profile information', outcome:'success', userId: userId, ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Get Profile Failed", 
            error: error.message
        })
        logger.error({ label:'User API', message: 'Get Profile Failed', outcome:'failed', userId: userId, ipAddress: req.ip, error: error.message })
    }

}


const updateUser = async (req, res) => { 
    const userId = req.userId
    const { username, password, confirm_password } = req.body

    try {
        let user = await updateProfile(userId, username, password, confirm_password, req)
        // send a json response
        res.status(200).json({
            mssg: "Update Profile Successful", 
            email: user["email"],
            username: user["username"],
        })
        logger.info({ label:'User API', message: 'Update profile information', outcome:'success', userId: userId, ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Update Profile Failed", 
            error: error.message
        })
        logger.error({ label:'User API', message: 'Update profile information', outcome:'failed', userId: userId, ipAddress: req.ip, error: error.message })
    }
}

const logoutUser = async (req, res) => { 
    const userId = req.userId
    const jwtToken = req.jwtToken

    try {
        let user = await logout(userId, jwtToken, req)
        // send a json response
        res.status(200).json({
            mssg: "Log out Successful", 
        })
        logger.info({ label:'User API', message: 'Log out Successful', outcome:'success', userId: userId, ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Log out Failed", 
            error: error.message
        })
        logger.error({ label:'User API', message: 'Log out Failed', outcome:'failed', userId: userId, ipAddress: req.ip, error: error.message })
    }
}

module.exports = {
    loginUser,
    signupUser,
    profileUser,
    updateUser,
    logoutUser
}