const ErrorHandler = require('../enums/errors');

const cleanErrorMessage = (message) => message.replace(/[\\"]/g, '');

module.exports = (validationSchema) => {
  return (req, res, next) => {
    const validationErrors = [];
    const requestParts = ['body', 'params', 'query'];

    requestParts.forEach((part) => {
      if (validationSchema[part]) {
        const { error } = validationSchema[part].validate(req[part], { abortEarly: false });
        if (error) {
          const errorMessages = error.details.map((detail) => cleanErrorMessage(detail.message));
          validationErrors.push(...errorMessages);
        }
      }
    });

    if (validationErrors.length) {
      return next(ErrorHandler.badRequest(validationErrors.join()));
    }

    // Proceed to the next middleware or route handler
    next();
  };
};
