const ErrorHandler = require('../enums/errors');

const cleanErrorMessage = (message) => message.replace(/[\\"]/g, '');

module.exports = (validationSchema) => {
  return (req, res, next) => {
    const validationErrors = {};
    const requestParts = ['body', 'params', 'query'];

    requestParts.forEach((part) => {
      if (validationSchema[part]) {
        const { error } = validationSchema[part].validate(req[part], { abortEarly: false });
        if (error) {
          error.details.forEach((detail) => {
            let field = detail.path;
            if (!field.length) field = ['Fields missing'];
            const message = cleanErrorMessage(detail.message);
            validationErrors[field] = message;
          });
        }
      }
    });
    if (Object.keys(validationErrors).length) {
      return next(ErrorHandler.badRequest(validationErrors));
    }
    next();
  };
};
