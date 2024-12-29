const logger = require('../../../../config/logger');
const PermissionService = require('./Permission.Service');
class PermissionController {
  async getAll(req, res, next) {
    try {
      const data = await PermissionService.initializePermissions();
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PermissionController();
