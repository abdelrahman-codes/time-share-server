const logger = require('../../../../config/logger');
const UserService = require('./User.Service');
class UserController {
  async createUser(req, res, next) {
    try {
      const data = await UserService.createUser(req.body, next);
      logger.info('User created');
      return res.status(200).json({ message: 'success', success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const users = await UserService.getAll();
      return res.sendResponse(users);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
