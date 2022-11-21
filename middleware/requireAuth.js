const jwt = require('jsonwebtoken')
const { queryDb }= require("../db_config/db")
const validator = require("validator")
const { aesDecrypt } = require("../encryption/aesEncryption")
const fs   = require('fs');
const path = require("path");

const publicKEY  = fs.readFileSync(path.resolve(__dirname, "../jwt-self-sign-certs/cert.pem"), 'utf8');

const requireAuth = async (req, res, next)  =>  {

    // Verify authentication 
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' })
    }

    try{

        // authorization header format
        // Bearer <JWT token>
        const jwtToken = authorization.split(' ')[1]
        const decryptedJwtToken = aesDecrypt(jwtToken, process.env.AES_PASS)  // getting the token 
        const { userId } = jwt.verify(decryptedJwtToken, publicKEY, { algorithm: "RS256" })

        const escapedJwtToken = validator.escape(decryptedJwtToken)
        const escaped_userId = validator.escape(userId)

        let query = {
            text: "select * from cryptown.users where userid=$1;",
            values: [escaped_userId]
        }

        let output = await queryDb(query)
        
        let jwtQuery = {
            text: "select * from cryptown.jwt where userid=$1 and jwt=$2;",
            values: [escaped_userId, escapedJwtToken]
        }

        console.log("USERID", escaped_userId)
        console.log("JWT TOKEN", escapedJwtToken)

        let jwtOutput = await queryDb(jwtQuery)

        if (jwtOutput["result"].length === 0) {
            console.log("User logged out")
            throw Error() 
        }

        req.userId = output["result"][0]["userid"]
        req.jwtToken = escapedJwtToken 
        
        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Request is not authorized' })
    }

}

module.exports = requireAuth