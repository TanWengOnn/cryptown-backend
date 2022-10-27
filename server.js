require("dotenv").config()
const express = require("express")
const cryptoRoutes = require("./routes/crypto")

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/cryptown/api', cryptoRoutes) 

app.listen(process.env.PORT, () => {
    console.log("listening on port", process.env.PORT)
})