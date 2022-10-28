require("dotenv").config()
const express = require("express")

// Https packages
const https = require("https");
const fs = require("fs");

const cors = require("cors")
const csrf = require("csurf")

const cryptoRoutes = require("./routes/crypto")
const exchangeRoutes = require("./routes/exchange")
const newsRoutes = require("./routes/news")


const app = express()

// Setting up https
let server = https.createServer({
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
  },app)


app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use(express.json())

// const csrfProtection = csrf({
//     cookie: true
// })
// app.use(csrfProtection)

// app.get('/cryptown/api/getCSRFToken', (req, res) => {
//     res.json({ CSRFtoken: req.CSRFToken() })
// })

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/cryptown/api/crypto', cryptoRoutes) 

app.use('/cryptown/api/exchange', exchangeRoutes) 

app.use('/cryptown/api/news', newsRoutes) 



server.listen(process.env.PORT, ()=>{
    console.log('server is runing at port', process.env.PORT)
});

// app.listen(process.env.PORT, () => {
//     console.log("listening on port", process.env.PORT)
// })



