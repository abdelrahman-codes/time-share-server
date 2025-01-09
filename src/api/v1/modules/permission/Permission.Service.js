const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../../../../enums/errors');
const Permission = require('./Permission.entity');
const { AccessLevelEnum, LeadFeatureEnum, ModuleEnum } = require('../../../../enums/permission');
const UserService = require('../user/User.Service');
class PermissionService {
  async initializePermissions(userId) {
    const user = await Permission.findOne({ userId });
    if (!user) {
      const permissionsToInsert = Object.values(LeadFeatureEnum).map((feature) => ({
        module: ModuleEnum.Lead,
        feature,
        accessLevel: AccessLevelEnum.View,
        userId,
      }));
      await Permission.insertMany(permissionsToInsert);
    }
  }
  async userPermissions(userId) {
    const permissions = await Permission.find({ userId });
    if (!permissions.length) {
      return {};
    }
    const groupedData = permissions.reduce((acc, permission) => {
      const moduleName = permission.module + ' Module';
      const permissionName = permission.feature;
      const accessLevel = permission.accessLevel;

      if (!acc[moduleName]) {
        acc[moduleName] = {
          hasAccess: false,
          features:{},
        };
      }

      acc[moduleName].features[permissionName] = accessLevel;

      if (accessLevel === AccessLevelEnum.View || accessLevel === AccessLevelEnum.Edit) {
        acc[moduleName].hasAccess = true;
      }

      return acc;
    }, {});
    return groupedData;
  }
  async updateFeatureAccessLevel(userId, feature, accessLevel) {
    await UserService.getDetails(userId);
    const updatedPermission = await Permission.findOneAndUpdate({ userId, feature }, { accessLevel });
    if (!updatedPermission) {
      throw ErrorHandler.notFound('Feature not found');
    }
    return 'Feature access level updated successfully';
  }
}
module.exports = new PermissionService();
