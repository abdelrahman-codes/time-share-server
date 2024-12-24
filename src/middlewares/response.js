const ResponseMiddleware = (req, res, next) => {
  res.sendResponse = (data, statusCode = 200) => {
    res.status(statusCode).send({
      success: true,
      statusCode,
      message: 'success',
      data,
    });
  };
  next();
};

module.exports = ResponseMiddleware;
