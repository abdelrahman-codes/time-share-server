class CustomError extends Error {
  constructor(status = 500, message = 'Internal Server Error', error = 'Internal Server Error') {
    super(message);
    this.status = status;
    this.error = error;
  }
}
const ErrorHandler = {
  internalServerError(message = 'Internal Server Error') {
    return new CustomError(500, message, 'Internal Server Error');
  },
  badRequest(message = 'Bad Request') {
    return new CustomError(400, message, 'Bad Request');
  },
  notFound(message = 'Not Found') {
    return new CustomError(404, message, 'Not Found');
  },
  unauthorized(message = 'Unauthorized') {
    return new CustomError(401, message, 'Unauthorized');
  },
  dynamicError(code = 500, message = 'Internal Server Error', error = 'Internal Server Error') {
    return new CustomError(code, message, error);
  },
};

module.exports = ErrorHandler;
