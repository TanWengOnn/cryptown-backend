const { getFavouriteList, addFavourite, deleteFavourite } = require("./functions/favouriteFunctions")

const favouriteList = async (req, res) => {
    const userId = req.userId

    try {
        let favourites = await getFavouriteList(userId, req)

        if (favourites["favourites"].length === 0) {
            res.status(200).json({
                userId,
                mssg: `${favourites["username"]} has No Favorites`, 
            }) 

            logger.info({ label:'Favourite API', message: 'Get favourite lists (user has no favourite)', outcome:'success', ipAddress: req.ip })
            return
        }
    
        res.status(200).json({
            mssg: "Get Favourite List Successful", 
            favourites: favourites["favourites"]
        })  
        logger.info({ label:'Favourite API', message: 'Get favourite lists', outcome:'success', userId: userId, ipAddress: req.ip })

    } catch (error) {
        res.status(400).json({
            mssg: "Get Favourite List Failed", 
            error: error.message
        })
        logger.error({ label:'Favourite API', message: 'Get favourite lists', outcome:'failed', userId: userId, ipAddress: req.ip, error: error.message })
    }
     
}


const favouriteAdd = async (req, res) => {
    const userId = req.userId
    const { cryptoId } = req.body

    try {
        await addFavourite(userId, cryptoId, req)
        res.status(200).json({
            mssg: "Add to favourite successful", 
        })
        logger.info({ label:'Favourite API', message: 'Add to favourite lists', outcome:'success', userId: userId, ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Add to favourite failed", 
            error: error.message
        })
        logger.error({ label:'Favourite API', message: 'Add to favourite lists', outcome:'failed', userId: userId, ipAddress: req.ip, error: error.message })
    }
}

const favouriteDelete = async (req, res) => {
    const userId = req.userId
    const { favId } = req.body
    
    try {
        await deleteFavourite(userId, favId, req)
        res.status(200).json({
            mssg: "Delete from favourite successful", 
        })  
        logger.info({ label:'Favourite API', message: 'Delete favourite lists', outcome:'success', userId: userId, ipAddress: req.ip })
    } catch (error) {
        res.status(400).json({
            mssg: "Delete from favourite failed", 
            error: error.message
        })
        logger.error({ label:'Favourite API', message: 'Delete favourite lists', outcome:'failed', userId: userId, ipAddress: req.ip, error: error.message })
    }
}

module.exports = {
    favouriteList,
    favouriteAdd,
    favouriteDelete
}