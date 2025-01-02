const logger = require('../../../../config/logger');
const PermissionService = require('./Permission.Service');
class PermissionController {
  async getAll(req, res, next) {
    try {
      const data = await PermissionService.userPermissions(req.params._id);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
  async updateFeatureAccessLevel(req, res, next) {
    try {
      const data = await PermissionService.updateFeatureAccessLevel(req.params._id, req.body.feature, req.body.accessLevel);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PermissionController();
