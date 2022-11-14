const { createLogger, format, transports } = require('winston');
const { combine, timestamp} = format;  

const logger = createLogger({
    format: combine(
        timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({ filename: './logs/error.log', level: 'error' }),
        new transports.File({ filename: './logs/warn.log', level: 'warn' }),
        new transports.File({ filename: './logs/info.log', level: 'info' }),
        new transports.File({ filename: './logs/http.log', level: 'http' }),
    ]
});
  
module.exports = logger
