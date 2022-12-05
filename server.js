require("dotenv").config()
const express = require("express")

const helmet = require("helmet")
const cors = require("cors")
const logger = require("./logger/loggerConfig")

const cryptoRoutes = require("./routes/crypto")
const exchangeRoutes = require("./routes/exchange")
const newsRoutes = require("./routes/news")
const userRoutes = require("./routes/user")
const favouriteRoutes = require("./routes/favourite")
const postRoutes = require("./routes/post")
const miscRoutes = require("./routes/misc")

const app = express()

// Enable get user IPs
app.set('trust proxy', true)

// Cross Origin Resource Sharing Policy, only allow "https://cryptown-besquare.one" and "http://localhost:3000"
app.use(cors({
    origin: ['https://cryptown-besquare.one', 'http://localhost:3000'],
    // methods: ['GET','POST','DELETE', 'PATCH']
}))

// modify response header
app.use(helmet())
app.use(express.json())

// Log API routes
app.use((req, res, next) => {
    logger.http({ 
        label:'API Route', 
        message: `API Route - ${req.ip} ${req.path} ${req.method} ${new Date()}`, 
        ipAddress: req.ip
    })
    console.log(req.path, req.method, new Date())
    next()
})

// Default api route
app.use('/api/user', userRoutes) 

app.use('/api/favourite', favouriteRoutes) 

app.use('/api/crypto', cryptoRoutes) 

app.use('/api/exchange', exchangeRoutes) 

app.use('/api/news', newsRoutes) 

app.use('/api/post', postRoutes) 

app.use('/api/misc', miscRoutes) 


app.listen(process.env.PORT, () => {
    console.log("listening on port", process.env.PORT)
})



