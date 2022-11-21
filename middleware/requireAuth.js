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

    // authorization header format
    // Bearer <JWT token>
    const jwtToken = authorization.split(' ')[1]

    try{
        const decryptedJwtToken = aesDecrypt(jwtToken, process.env.AES_PASS)  // getting the token 
        const { userId } = jwt.verify(decryptedJwtToken, publicKEY, { algorithm: "RS256" })

        const escapedJwtToken = validator.escape(decryptedJwtToken)
        const escaped_userId = validator.escape(userId)

        let query = {
            text: "select * from cryptown.users where userid=$1;",
            values: [escaped_userId]
        }

        let output = await queryDb(query)

        if (output["result"].length === 0) {
            throw Error() 
        }
        
        let jwtQuery = {
            text: "select * from cryptown.jwt where userid=$1 and jwt=$2;",
            values: [escaped_userId, escapedJwtToken]
        }

        let jwtOutput = await queryDb(jwtQuery)

        if (jwtOutput["result"].length === 0) {
            throw Error() 
        }

        req.userId = output["result"][0]["userid"]
        req.jwtToken = escapedJwtToken 
        
        next()

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            const decryptedJwtToken = aesDecrypt(jwtToken, process.env.AES_PASS)  // getting the token 
            const { userId } = jwt.verify(decryptedJwtToken, publicKEY, { ignoreExpiration: true, algorithm: "RS256" })

            const escapedJwtToken = validator.escape(decryptedJwtToken)
            const escaped_userId = validator.escape(userId)

            let jwtQuery = {
                text: "select * from cryptown.jwt where userid=$1 and jwt=$2;",
                values: [escaped_userId, escapedJwtToken]
            }

            let jwtOutput = await queryDb(jwtQuery)

            if (jwtOutput["result"].length !== 0) {

                let deleteJwt = {
                    text: 
                    `delete from cryptown.jwt where jwt=$1 and userid=$2;`,
                    values: [escapedJwtToken, escaped_userId]
                }
            
                let deleteJwtOutput = await queryDb(deleteJwt)
            
                if (deleteJwtOutput["error"] !== undefined) {
                    // logger.warn({ label:'Favourite API', message: `Failed to delete favourite - ${escaped_favId}`, outcome:'failed', user: escaped_userId, ipAddress: req.ip})
                    throw Error("Failed to delete jwt")
                }
            }
        }
        
        res.status(401).json({ error: 'Request is not authorized' })
    }

}

module.exports = requireAuth