const logger = require('../../../../config/logger');
const AuthService = require('./Auth.Service');
class UserController {
  async dashboardLogin(req, res, next) {
    try {
      const data = await AuthService.dashboardLogin(req.body);
      logger.info(`User logged in: ${data?.user?.name}`);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }

  async mobileLogin(req, res, next) {
    try {
      const data = await AuthService.mobileLogin(req.body);
      logger.info(`User logged in: ${data?.user?.name}`);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
