const logger = require('../config/logger');
const deleteFile = require('../helpers/delete-file');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.error || 'Unknown Error';
  if (req?.body?.url) deleteFile(`./public/media/${req.body.url}`);
  if (statusCode === 500) logger.error(`Error occurred: ${message}`);
  res.status(statusCode).send({
    success: false,
    statusCode,
    message,
    errors,
  });
};
module.exports = errorHandler;
