const { createLogger, format, transports } = require('winston');
const { combine, timestamp} = format;  

const httpTransportOptions = {
    host: 'http-intake.logs.datadoghq.com',
    path: '/api/v2/logs?dd-api-key=800b692d9e047729305de9ec13e6607d&ddsource=nodejs&service=cryptown',
    ssl: true
  };

const logger = createLogger({
    format: combine(
        timestamp(),
        format.json()
    ),
    transports: [
        new transports.Http({httpTransportOptions, level: 'http'}),
        new transports.File({ filename: './logs/error.log', level: 'error' }),
        new transports.File({ filename: './logs/warn.log', level: 'warn' }),
        new transports.File({ filename: './logs/info.log', level: 'info' }),
        new transports.File({ filename: './logs/http.log', level: 'http' }),
    ]
});
  
module.exports = logger
