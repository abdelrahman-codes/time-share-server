const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const error = err.error || 'Unknown Error';

  if (statusCode === 500) logger.error(`Error occurred: ${message}`);
  res.status(statusCode).send({
    success: false,
    statusCode,
    message,
    error,
  });
};
module.exports = errorHandler;
