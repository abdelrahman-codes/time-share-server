const jwt = require('jsonwebtoken');
const ErrorHandler = require('../enums/errors');
const User = require('../api/v1/modules/user/User.entity');
const Permission = require('../api/v1/modules/permission/Permission.entity');

module.exports = (allowedRoles, feature, accessLevel) => {
  return async (req, res, next) => {
    if (!req.headers.authorization) return next(ErrorHandler.unauthorized({},'Must send a token first'));

    const token = req.headers.authorization.split(' ')[1];
    if (!token) return next(ErrorHandler.unauthorized({},'Must send a token first'));

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, async (err, decoded) => {
      if (err) return next(ErrorHandler.unauthorized());
      if (!allowedRoles.includes(decoded.role)) return next(ErrorHandler.unauthorized());
      const user = await User.findOne({ _id: decoded.sub });
      if (!user) return next(ErrorHandler.unauthorized({},'User no longer exists'));
      if (!user.active) return next(ErrorHandler.dynamicError(401, 'Your account is inactive', {}));

      if (feature && accessLevel) {
        const hasPermissionOnFeature = await Permission.findOne({ userId: user._id, feature });
        if (!hasPermissionOnFeature) return next(ErrorHandler.unauthorized({},'Access denied: insufficient permissions'));
        if (hasPermissionOnFeature.accessLevel !== 'Edit') {
          if (accessLevel !== hasPermissionOnFeature.accessLevel)
            return next(ErrorHandler.unauthorized({},'Access denied: insufficient permissions'));
        }
      }
      req.token = decoded;
      return next();
    });
  };
};
