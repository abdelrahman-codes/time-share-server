const logger = require('../../../../config/logger');
const UserService = require('./User.Service');
class UserController {
  async createUser(req, res, next) {
    try {
      const { password, ...result } = await UserService.createUser(req.body);
      logger.info('User created');
      return res.sendResponse(result);
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      let { searchTerm } = req.query;
      if (!searchTerm) searchTerm = '';
      const users = await UserService.getAll(searchTerm);
      return res.sendResponse(users);
    } catch (error) {
      next(error);
    }
  }

  async getDetails(req, res, next) {
    try {
      let _id = req?.params?._id || req?.token?.sub;
      const user = await UserService.getDetails(_id);
      return res.sendResponse(user);
    } catch (error) {
      next(error);
    }
  }
  async updateUser(req, res, next) {
    try {
      let _id = req.params._id || req?.token?.sub;
      const { password, ...result } = await UserService.updateUser(_id, req.body);
      logger.info('User updated');
      return res.sendResponse(result);
    } catch (error) {
      next(error);
    }
  }
  async toggleActiveStatus(req, res, next) {
    try {
      const { _id } = req.params;
      const result = await UserService.toggleActiveStatus(_id);
      return res.sendResponse(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
