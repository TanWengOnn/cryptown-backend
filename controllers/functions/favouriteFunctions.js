const { queryDb }= require("../../db_config/db")
const validator = require("validator")
const { v4: uuidv4 } = require('uuid');
const logger = require("../../logger/loggerConfig")

const getFavouriteList = async function(userId, req) {
    let escaped_userId = validator.escape(userId)

    let checkUser = {
        text: "select * from cryptown.users where userid=$1",
        values: [escaped_userId]
    }

    let user = await queryDb(checkUser)

    if (user["result"].length === 0) {
        logger.warn({ 
            label:'Favourite API', 
            message: 'Get Favourite - User does not exist', 
            outcome:'failed', 
            user: escaped_userId, 
            ipAddress: req.ip,
            error: "User does not exist"
        })
        throw Error('User does not exist')
    }

    let getFavourites = {
        text: "select favid, coinname, image_url, cryptoid from cryptown.favourite where userid=$1",
        values: [escaped_userId]
    }

    let favourites = await queryDb(getFavourites)
    
    logger.http({ 
        label:'Favourite API', 
        message: 'Get Favourite - Query favourite list', 
        outcome:'success', 
        user: escaped_userId, 
        ipAddress: req.ip 
    })
    return {
        favourites: favourites["result"],
        username: user["result"][0]["username"],
    }

}


const addFavourite = async function(userId, cryptoId, coinName, image_url, req) {
    let escaped_userId = validator.escape(userId)
    let escaped_cryptoId = validator.escape(cryptoId)
    let escaped_coinName = validator.escape(coinName)


    let checkUser = {
        text: "select * from cryptown.users where userid=$1",
        values: [escaped_userId]
    }

    let user = await queryDb(checkUser)

    if (user["result"].length === 0) {
        logger.warn({ 
            label:'Favourite API', 
            message: 'Add Favourite - User does not exist', 
            outcome:'failed', 
            user: escaped_userId, 
            ipAddress: req.ip,
            error: "User does not exist"
        })
        throw Error('User does not exist')
    }

    let checkCryptoId = {
        text: "select * from cryptown.favourite where cryptoid=$1 and userid=$2;",
        values: [escaped_cryptoId, escaped_userId]
      }

    let checkCryptoIdOuput = await queryDb(checkCryptoId)

    if (checkCryptoIdOuput["result"].length !== 0) {
        logger.http({ 
            label:'Favourite API', 
            message: `Add Favourite - Coin already added - ${escaped_coinName}`, 
            outcome:'failed', 
            user: escaped_userId, 
            ipAddress: req.ip,
            error: "Coin Already Added"
        })
        throw Error('Coin Already Added')
    }

    let favId = uuidv4()
    
    let addFavourites = {
        text: 
        `insert into cryptown.favourite 
            (favid, userid, coinname, cryptoId, image_url) 
            values 
            ($1, $2, $3, $4, $5)`,
        values: [favId, escaped_userId, escaped_coinName, escaped_cryptoId, image_url]
    }

    let favourites = await queryDb(addFavourites)

    if (favourites["error"] !== undefined) {
        logger.error({ 
            label:'Favourite API', 
            message: `Add Favourite - Failed to add to favourite - ${escaped_coinName}`, 
            outcome:'failed', 
            user: escaped_userId, 
            ipAddress: req.ip,
            error: favourites["error"]
        })
        throw Error("Failed to add to favourite")
    }
    
    logger.http({ 
        label:'Favourite API', 
        message: `Add Favourite - Successfully to add to favourite - ${escaped_coinName}`, 
        outcome:'success', 
        user: escaped_userId, 
        ipAddress: req.ip 
    })
    return {
        favid: favId,
        coinname: escaped_coinName,
        cryptoid: escaped_cryptoId,
        image_url
    }
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
        logger.warn({ 
            label:'Favourite API', 
            message: 'Delete Favourite - User does not exist', 
            outcome:'failed', 
            user: escaped_userId, 
            ipAddress: req.ip,
            error: 'User does not exist'
        })
        throw Error('User does not exist')
    }

    let checkFavId = {
        text: "select * from cryptown.favourite where favid=$1 and userid=$2;",
        values: [escaped_favId, escaped_userId]
      }

    let checkFavIdOuput = await queryDb(checkFavId)

    if (checkFavIdOuput["result"].length === 0) {
        logger.warn({ 
            label:'Favourite API', 
            message: `Delete Favourite - Favourite coin does not exist - ${escaped_favId}`, 
            outcome:'failed', 
            user: escaped_userId, 
            ipAddress: req.ip,
            error: 'Favourite Coin Does Not Exist'
        })
        throw Error('Favourite Coin Does Not Exist')
    }

    let deleteFavourites = {
        text: 
        `delete from cryptown.favourite where favid=$1 and userid=$2;`,
        values: [escaped_favId, escaped_userId]
    }

    let favourites = await queryDb(deleteFavourites)

    if (favourites["error"] !== undefined) {
        logger.error({ 
            label:'Favourite API', 
            message: `Delete Favourite - Failed to delete favourite - ${escaped_favId}`, 
            outcome:'failed', 
            user: escaped_userId, 
            ipAddress: req.ip,
            error: favourites["error"]
        })
        throw Error("Failed to delete favourite")
    }
    
    logger.http({ 
        label:'Favourite API', 
        message: `Delete Favourite - Successfully to delete favourite - ${escaped_favId}`, 
        outcome:'success', 
        user: escaped_userId, 
        ipAddress: req.ip 
    })
    return {
        favid: escaped_favId
    }

}

module.exports = {
    getFavouriteList,
    addFavourite,
    deleteFavourite
}