const { queryDb }= require("../../db_config/db")
const validator = require("validator")
const { v4: uuidv4 } = require('uuid');

const getFavouriteList = async function(userId, req) {
    let escaped_userId = validator.escape(userId)

    let checkUser = {
        text: "select * from cryptown.users where userid=$1",
        values: [escaped_userId]
    }

    let user = await queryDb(checkUser)

    if (user["result"].length === 0) {
        logger.warn({ label:'Favourite API', message: 'User does not exist', outcome:'failed', user: escaped_userId, ipAddress: req.ip})
        throw Error('User does not exist')
    }

    // insert into cryptown.favourite (favid, userid, coinname) values ('1', 'f019e744-cb2d-44e7-a52d-b7e1a4c4bfc5', 'Bitcoin')
    let getFavourites = {
        text: "select favid, coinname from cryptown.favourite where userid=$1",
        values: [escaped_userId]
    }

    let favourites = await queryDb(getFavourites)
    
    logger.http({ label:'Favourite API', message: 'Query favourite list', outcome:'success', user: escaped_userId, ipAddress: req.ip })
    return {
        favourites: favourites["result"],
        username: user["result"][0]["username"],
    }

}


const addFavourite = async function(userId, coinName, req) {
    let escaped_userId = validator.escape(userId)
    let escaped_coinName = validator.escape(coinName)


    let checkUser = {
        text: "select * from cryptown.users where userid=$1",
        values: [escaped_userId]
    }

    let user = await queryDb(checkUser)

    if (user["result"].length === 0) {
        logger.warn({ label:'Favourite API', message: 'User does not exist', outcome:'failed', user: escaped_userId, ipAddress: req.ip})
        throw Error('User does not exist')
    }

    let checkCoinName = {
        text: "select * from cryptown.favourite where coinname=$1 and userid=$2;",
        values: [escaped_coinName, escaped_userId]
      }

    let checkCoinNameOuput = await queryDb(checkCoinName)

    if (checkCoinNameOuput["result"].length !== 0) {
        logger.http({ label:'Favourite API', message: `Coin already added - ${escaped_coinName}`, outcome:'failed', user: escaped_userId, ipAddress: req.ip})
        throw Error('Coin Already Added')
    }

    let favId = uuidv4()
    // let escapedCoinName = validator.escape(coinName)
    // insert into cryptown.favourite (favid, userid, coinname) values ('1', 'f019e744-cb2d-44e7-a52d-b7e1a4c4bfc5', 'Bitcoin')
    let addFavourites = {
        text: 
        `insert into cryptown.favourite 
            (favid, userid, coinname) 
            values 
            ($1, $2, $3)`,
        values: [favId, escaped_userId, escaped_coinName]
    }
    console.log(escaped_coinName)
    let favourites = await queryDb(addFavourites)

    if (favourites["error"] !== undefined) {
        logger.warn({ label:'Favourite API', message: `Failed to add to favourite - ${escaped_coinName}`, outcome:'failed', user: escaped_userId, ipAddress: req.ip})
        throw Error("Failed to add to favourite")
    }
    
    logger.http({ label:'Favourite API', message: `Successfully to add to favourite - ${escaped_coinName}`, outcome:'success', user: escaped_userId, ipAddress: req.ip })
    return true
}


const deleteFavourite = async function(userId, favId, req) {
    let escaped_userId = validator.escape(userId)
    let escaped_favId = validator.escape(favId)

    let checkUser = {
        text: "select * from cryptown.users where userid=$1",
        values: [escaped_userId]
    }

    let user = await queryDb(checkUser)

    if (user["result"].length === 0) {
        logger.warn({ label:'Favourite API', message: 'User does not exist', outcome:'failed', user: escaped_userId, ipAddress: req.ip})
        throw Error('User does not exist')
    }

    let checkFavId = {
        text: "select * from cryptown.favourite where favid=$1 and userid=$2;",
        values: [escaped_favId, escaped_userId]
      }

    let checkFavIdOuput = await queryDb(checkFavId)

    if (checkFavIdOuput["result"].length === 0) {
        logger.warn({ label:'Favourite API', message: `Favourite coin does not exist - ${escaped_favId}`, outcome:'failed', user: escaped_userId, ipAddress: req.ip})
        throw Error('Favourite Coin Does Not Exist')
    }

    let deleteFavourites = {
        text: 
        `delete from cryptown.favourite where favid=$1 and userid=$2;`,
        values: [escaped_favId, escaped_userId]
    }

    let favourites = await queryDb(deleteFavourites)

    if (favourites["error"] !== undefined) {
        logger.warn({ label:'Favourite API', message: `Failed to delete favourite - ${escaped_favId}`, outcome:'failed', user: escaped_userId, ipAddress: req.ip})
        throw Error("Failed to delete favourite")
    }
    
    logger.http({ label:'Favourite API', message: `Successfully to delete favourite - ${escaped_coinName}`, outcome:'success', user: escaped_userId, ipAddress: req.ip })
    return true

}

module.exports = {
    getFavouriteList,
    addFavourite,
    deleteFavourite
}