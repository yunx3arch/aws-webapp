const winston = require('winston');

const logger = winston.createLogger({
      level: "debug",
      format: winston.format.json(),
      transports: [ new winston.transports.File({ filename: 'app.log' })],
    });
    logger.log("debug", "Logger working ok!");

    module.exports = logger;