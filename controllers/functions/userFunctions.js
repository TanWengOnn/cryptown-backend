const { queryDb }= require("../../db_config/db")
// const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt") 
const validator = require("validator")
const { v4: uuidv4 } = require('uuid');

let password_requirement = { 
    minLength: 8, 
    minLowercase: 1, 
    minUppercase: 1, 
    minNumbers: 1, 
    minSymbols: 1, 
    returnScore: false, 
    pointsPerUnique: 1, 
    pointsPerRepeat: 0.5, 
    pointsForContainingLower: 10, 
    pointsForContainingUpper: 10, 
    pointsForContainingNumber: 10, 
    pointsForContainingSymbol: 10 
}

// Login Function
const login = async function (email, password) {
    // validation 
    if (!email || !password) {
        throw Error("All Field must be filled")
    }

    if (/[^\w\d@.]/.test(email)) {
        throw Error("Please do not include special characters")
    } 


    // Check if the user exist 
    let checkUser = {
        text: "select * from cryptown.users where email=$1;",
        values: [email]
      }

    let user = await queryDb(checkUser)

    if (user["result"].length === 0) {
        throw Error('Incorrect Email or Password')
    }

    let currentDateTime = new Date()
    let attempts = user["result"][0]["attempts"]
    let banDateTime = user["result"][0]["bandatetime"]
    let banDuration = currentDateTime - banDateTime

    if (banDuration > 30000 && banDateTime !== null) {
        let update = {
            text: 
            `
                update cryptown.users set 
                    attempts=$1,
                    bandatetime=$2
                where email=$3;
            `,
            values: [0, null, email]
        }
    
        let updateDateTime = await queryDb(update)
        attempts = 0;
        if (updateDateTime["error"] !== undefined) {
            throw Error('Profile update ban datetime failed')
        }
    }

    if (attempts >= 3) {
        throw Error("maximum attempts reach please try again in 30 seconds")
    }
   
    const match = await bcrypt.compare(password, user["result"][0]["password"])

    if (!match) {
        let incrementAttempts = attempts + 1
        let update = {
            text: 
            `
                update cryptown.users set 
                    attempts=$1
                where email=$2;
            `,
            values: [incrementAttempts, email]
        }
    
        let updateAttempts = await queryDb(update)
    
        if (updateAttempts["error"] !== undefined) {
            throw Error('Profile update attempts failed')
        }

        // console.log(incrementAttempts)

        if (incrementAttempts >= 3) {
            if (banDateTime === null) {
                let update = {
                    text: 
                    `
                        update cryptown.users set 
                            bandatetime=$1
                        where email=$2;
                    `,
                    values: [currentDateTime, email]
                }
            
                let updateDateTime = await queryDb(update)
            
                if (updateDateTime["error"] !== undefined) {
                    throw Error('Profile update ban datetime failed')
                }
                throw Error("maximum attempts reach please try again in 30 seconds")
            }
        }
        throw Error('Incorrect Email or Password')
    }

    let update = {
        text: 
        `
            update cryptown.users set 
                attempts=$1
            where email=$2;
        `,
        values: [0, email]
    }

    let updateAttempts = await queryDb(update)

    if (updateAttempts["error"] !== undefined) {
        throw Error('Profile update attempts failed')
    }

    return user["result"][0]
}


// Signup Function
const signup = async function (email, username, password, confirm_password) {

    // validation 
    if (!email || !username || !password || !confirm_password) {
        throw Error("All Field must be filled")
    }
    // check if the email is valid and checks for special symbols except '@' and '.'
    if (!validator.isEmail(email) || /[^\w\d@.]/.test(email)) {
        throw Error("Email is not valid")
    }

    // check if password is requirement is met
    if (!validator.isStrongPassword(password, password_requirement)) {
        throw Error("Password is too weak")
    }

    // chekc is password and confirm password is the same
    if (password !== confirm_password) {
        throw Error("Password not the same")
    }

    // Check if the email alrealdy exist 
    let checkEmail = {
        text: "select * from cryptown.users where email=$1;",
        values: [email]
      }

    let emailOutput = await queryDb(checkEmail)

    if (emailOutput["result"].length !== 0) {
        throw Error('Email already in use')
    }

    // Bcrypt password hashing with salting
    const salt = await bcrypt.genSalt(10)
    const passHash = await bcrypt.hash(password, salt)

    // Generate User Id
    let userId = uuidv4()

    // Add user to database
    let addUser = {
        text: "insert into cryptown.users (userid, email, username, password, attempts) values ($1, $2, $3, $4, $5)",
        values: [userId, email, validator.escape(username), passHash, 0]
      }

    let user = await queryDb(addUser)

    // Error when adding user to database
    if (user["error"] !== undefined) {
        return false
    }
    
    // Successfully added user to database
    return true
}


const profile = async function(userId) {
    let query = {
        text: "select * from cryptown.users where userid=$1",
        values: [userId]
    }

    let user = await queryDb(query)

    if (user["result"].length === 0) {
        throw Error('User does not exist')
    }



    return user["result"][0]
}


const updateProfile = async function(userId, username, password, confirm_password) {

    // check if new password requirement is met
    if (!validator.isStrongPassword(password, password_requirement)) {
        throw Error("Password is too weak")
    }

    // check if new password and confirm password is the same
    if (password !== confirm_password) {
        throw Error("Password not the same")
    }

    // escape username 
    let escapedUsername = validator.escape(username)

    // Hashing new password
    const salt = await bcrypt.genSalt(10)
    const passHash = await bcrypt.hash(password, salt)

    // SQL Query for conditional update
    // Reference: https://medium.com/developer-rants/conditional-update-in-postgresql-a27ddb5dd35 
    let update = {
        text: 
        `
            update cryptown.users set 
                username=coalesce(nullif($1,''), username), 
                password=coalesce(nullif($2,''), password) 
            where userid=$3;
        `,
        values: [escapedUsername, passHash, userId]
    }

    let updateUser = await queryDb(update)

    if (updateUser["error"] !== undefined) {
        throw Error('Profile Update Failed')
    }

    let getUpdatedUser = {
        text: "select * from cryptown.users where userid=$1",
        values: [userId]
    }

    let user = await queryDb(getUpdatedUser)

    if (user["result"].length === 0) {
        throw Error('User does not exist')
    }


    return user["result"][0]
}


module.exports = {
    login,
    signup,
    profile,
    updateProfile
}