const { queryDb }= require("../db_config/db")
const validator = require("validator")
const { v4: uuidv4 } = require('uuid');


const favouriteList = async (req, res) => {
    const userId = req.userId

    try {
        let favourites = await getFavouriteList(userId)
        console.log(favourites["favourites"])

        if (favourites["favourites"].length === 0) {
            res.status(200).json({
                userId,
                mssg: `${favourites["username"]} has No Favorites`, 
            }) 
    
            return
        }
    
        res.status(200).json({
            mssg: "Get Favourite List Successful", 
            userId,
            favourites: favourites["favourites"]
        })  

    } catch (error) {
        res.status(400).json({
            mssg: "Get Favourite List Failed", 
            error: error.message
        })
    }
     
}


const favouriteAdd = async (req, res) => {
    const userId = req.userId
    const { cryptoId } = req.body
    console.log(req.body)

    try {
        await Addfavourite(userId, cryptoId)
        res.status(200).json({
            mssg: "Add to favourite successful", 
        })
    } catch (error) {
        res.status(400).json({
            mssg: "Add to favourite failed", 
            error: error.message
        })
    }
}

const favouriteDelete = async (req, res) => {
    const userId = req.userId

    // insert into cryptown.favourite (favid, userid, coinname) values ('1', 'f019e744-cb2d-44e7-a52d-b7e1a4c4bfc5', 'Bitcoin')

    res.status(200).json({
        mssg: "Favourite Delete API", 
        userId,
    })   
}



//-------------Functions-------------//

const getFavouriteList = async function(userId) {

    let checkUser = {
        text: "select * from cryptown.users where userid=$1",
        values: [userId]
    }

    let user = await queryDb(checkUser)

    if (user["result"].length === 0) {
        throw Error('User does not exist')
    }

    // insert into cryptown.favourite (favid, userid, coinname) values ('1', 'f019e744-cb2d-44e7-a52d-b7e1a4c4bfc5', 'Bitcoin')
    let getFavourites = {
        text: "select * from cryptown.favourite where userid=$1",
        values: [userId]
    }

    let favourites = await queryDb(getFavourites)
    

    return {
        favourites: favourites["result"],
        username: user["result"][0]["username"],
    }

}


const Addfavourite = async function(userId, coinName) {

    let checkUser = {
        text: "select * from cryptown.users where userid=$1",
        values: [userId]
    }

    let user = await queryDb(checkUser)
    // console.log(coinName)

    if (user["result"].length === 0) {
        throw Error('User does not exist')
    }

    let checkCoinName = {
        text: "select * from cryptown.favourite where coinname=$1 and userid=$2;",
        values: [coinName, userId]
      }

    let checkCoinNameOuput = await queryDb(checkCoinName)

    if (checkCoinNameOuput["result"].length !== 0) {
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
        values: [favId, userId, coinName]
    }

    let favourites = await queryDb(addFavourites)

    if (favourites["error"] !== undefined) {
        throw Error("Failed to add to favourite")
    }
    
    return true

}

const Deletefavourite = async function(userId, coinName) { 

}



module.exports = {
    favouriteList,
    favouriteAdd,
    favouriteDelete
}