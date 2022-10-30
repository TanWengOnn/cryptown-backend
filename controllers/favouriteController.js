const { queryDb }= require("../db_config/db")

const favouriteList = async (req, res) => {
    const userId = req.userId

    // insert into cryptown.favourite (favid, userid, coinname) values ('1', 'f019e744-cb2d-44e7-a52d-b7e1a4c4bfc5', 'Bitcoin')

    res.status(200).json({
        mssg: "Favourite List API", 
        userId,
    })   
}


const favouriteAdd = async (req, res) => {
    const userId = req.userId

    // insert into cryptown.favourite (favid, userid, coinname) values ('1', 'f019e744-cb2d-44e7-a52d-b7e1a4c4bfc5', 'Bitcoin')

    res.status(200).json({
        mssg: "Favourite Add API", 
        userId,
    })   
}

const favouriteDelete = async (req, res) => {
    const userId = req.userId

    // insert into cryptown.favourite (favid, userid, coinname) values ('1', 'f019e744-cb2d-44e7-a52d-b7e1a4c4bfc5', 'Bitcoin')

    res.status(200).json({
        mssg: "Favourite Delete API", 
        userId,
    })   
}

module.exports = {
    favouriteList,
    favouriteAdd,
    favouriteDelete
}