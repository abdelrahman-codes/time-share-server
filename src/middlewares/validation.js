const ErrorHandler = require('../enums/errors');

const sanitizeErrorMessage = (message) => {
  return message.replace(/[\\"]/g, ''); // Remove all backslashes and quotation marks
};
module.exports = (schema) => {
  return (req, res, next) => {
    const validation = [];
    const reqOptions = ['body', 'params', 'query'];
    reqOptions.forEach((key) => {
      if (schema[key]) {
        // abortEarly: false if we need to return all of the errors at a time
        const validateRequest = schema[key].validate(req[key]);
        if (validateRequest.error) validation.push(sanitizeErrorMessage(validateRequest.error.details[0].message));
      }
    });

    if (validation.length) return next(ErrorHandler.badRequest(validation.join()));

    next();
  };
};
