const { ErrorTypes } = require('./error-types');

class CustomError extends Error {
  constructor(status = 500, message = 'Internal Server Error', error = 'Internal Server Error') {
    super(message);
    this.status = status;
    this.error = error;
  }
}
const ErrorHandler = {
  internalServerError(error = {}, message = ErrorTypes.InternalServerError) {
    return new CustomError(500, message, error);
  },
  badRequest(error = {}, message = ErrorTypes.BadRequest) {
    return new CustomError(400, message, error);
  },
  notFound(error = {}, message = ErrorTypes.NotFound) {
    return new CustomError(404, message, error);
  },
  unauthorized(error = {}, message = ErrorTypes.Unauthorized) {
    return new CustomError(401, message, error);
  },
  dynamicError(code = 500, message = ErrorTypes.InternalServerError, error = {}) {
    return new CustomError(code, message, error);
  },
};

module.exports = ErrorHandler;
