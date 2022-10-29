const { Pool } = require("pg") 
const { app_config } = require("./db_config")

const pool = new Pool(app_config.db)

pool.on('error', (err, client) => {
    console.error('Error:', err)
})

const queryDb = async (query) => {
    let response = {}
    try {
        const client = await pool.connect()
        const res = await client.query(query)
        await client.release()
        response.result = res.rows
        // await client.end()
    } catch (error) {
        response.error = error.stack
    }

    return response
}

module.exports = {
  queryDb
}