const jwt = require('jsonwebtoken')
const { queryDb }= require("../db_config/db")
const fs   = require('fs');
const path = require("path");

const publicKEY  = fs.readFileSync(path.resolve(__dirname, "../jwt-self-sign-certs/cert.pem"), 'utf8');

const requireAuth = async (req, res, next)  =>  {

    // Verify authentication 
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' })
    }

    // autorization header format
    // Bearer <JWT token>
    const jwtToken = authorization.split(' ')[1]  // getting the token 

    try{
        const { userId } = jwt.verify(jwtToken, publicKEY, { algorithm: "RS256" })

        let query = {
            text: "select * from cryptown.users where userid=$1;",
            values: [userId]
        }

        let output = await queryDb(query)
        // req.user = output["result"][0]["userid"]
        req.userId = output["result"][0]["userid"]
        
        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Request is not authorized' })
    }

}

module.exports = requireAuth