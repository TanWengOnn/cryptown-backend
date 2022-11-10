const { getFavouriteList, addFavourite, deleteFavourite } = require("./functions/favouriteFunctions")

const favouriteList = async (req, res) => {
    const userId = req.userId

    try {
        let favourites = await getFavouriteList(userId)

        if (favourites["favourites"].length === 0) {
            res.status(200).json({
                userId,
                mssg: `${favourites["username"]} has No Favorites`, 
            }) 
    
            return
        }
    
        res.status(200).json({
            mssg: "Get Favourite List Successful", 
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

    try {
        await addFavourite(userId, cryptoId)
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
    const { favId } = req.body
    
    try {
        await deleteFavourite(userId, favId)
        res.status(200).json({
            mssg: "Delete from favourite successful", 
        })  

    } catch (error) {
        res.status(400).json({
            mssg: "Delete from favourite failed", 
            error: error.message
        })
    }
}

module.exports = {
    favouriteList,
    favouriteAdd,
    favouriteDelete
}