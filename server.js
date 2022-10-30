require("dotenv").config()
const express = require("express")

// Https packages
const https = require("https");
const fs = require("fs");

const helmet = require("helmet")
const cors = require("cors")
const csrf = require("csurf")

const cryptoRoutes = require("./routes/crypto")
const exchangeRoutes = require("./routes/exchange")
const newsRoutes = require("./routes/news")
const userRoutes = require("./routes/user")
const favouriteRoutes = require("./routes/favourite")
const postRoutes = require("./routes/post")




const app = express()

// Setting up https
let server = https.createServer({
    key: fs.readFileSync("./certs/key.pem"),
    cert: fs.readFileSync("./certs/cert.pem"),
  },app)


app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(helmet())
app.use(express.json())

// const csrfProtection = csrf({
//     cookie: true
// })
// app.use(csrfProtection)

// app.get('/api/getCSRFToken', (req, res) => {
//     res.json({ CSRFtoken: req.CSRFToken() })
// })

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Default api route
app.use('/api/user', userRoutes) 

app.use('/api/favourite', favouriteRoutes) 

app.use('/api/crypto', cryptoRoutes) 

app.use('/api/exchange', exchangeRoutes) 

app.use('/api/news', newsRoutes) 

app.use('/api/post', postRoutes) 




server.listen(process.env.PORT, ()=>{
    console.log('server is runing at port', process.env.PORT)
});

// app.listen(process.env.PORT, () => {
//     console.log("listening on port", process.env.PORT)
// })



