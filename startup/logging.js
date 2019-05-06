const winston = require('winston');
require('express-async-errors');

module.exports = function() {

    winston.configure({
        level: 'info',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(info => {
                return `${info.timestamp} ${info.level}: ${info.message}`;
            })
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'errors.log', level: 'error' }),
            new winston.transports.File({ filename: 'combined.log', level: 'info' })],
        exceptionHandlers: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'uncaught.log' })]
    });

    process.on('unhandledRejection', ex => {
        throw new Error(ex);
    });    
}