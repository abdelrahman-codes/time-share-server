const jwt = require('jsonwebtoken');
const ErrorHandler = require('../enums/errors');
const Roles = require('../enums/roles');
const User = require('../api/v1/modules/user/User.entity');

module.exports = (allowedRoles) => {
  return async (req, res, next) => {
    if (!req.headers.authorization) return next(ErrorHandler.unauthorized('Must send a token first'));

    const token = req.headers.authorization.split(' ')[1];
    if (!token) return next(ErrorHandler.unauthorized('Must send a token first'));

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, async (err, decoded) => {
      if (err) return next(ErrorHandler.unauthorized());
      if (!allowedRoles.includes(decoded.role)) return next(ErrorHandler.unauthorized());

      switch (decoded.role) {
        case Roles.User:
          const user = await User.findOne({ _id: decoded.sub });
          if (!user) return next(ErrorHandler.unauthorized('User no longer exists'));
          if (!user.active) return next(ErrorHandler.dynamicError(401, 'Your account is inactive', 'Unauthorized'));
          req.token = decoded;
          return next();
        default:
          return next(ErrorHandler.unauthorized());
      }
    });
  };
};
