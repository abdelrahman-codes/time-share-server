const path = require('path');
const logger = require('../../../../config/logger');
const ErrorHandler = require('../../../../enums/errors');
const Roles = require('../../../../enums/roles');
const deleteFile = require('../../../../helpers/delete-file');
const User = require('./User.entity');
const { ValidationTypes } = require('../../../../enums/error-types');
class UserService {
  async createUser(data) {
    const user = await User.findOne({ $or: [{ username: data.username.toLowerCase() }, { mobile: data.mobile }] });
    if (user) {
      if (user.username === data.username.toLowerCase()) {
        logger.warn(`Attempt to create a user with existing username: ${data.username}`);
        throw ErrorHandler.badRequest({ username: ValidationTypes.AlreadyExists }, 'Username already exists');
      }
      logger.warn(`Attempt to create a user with existing mobile: ${data.mobile}`);
      throw ErrorHandler.badRequest({ mobile: ValidationTypes.AlreadyExists }, 'Mobile number already exists');
    }
    data.username = data.username.toLowerCase();
    // if (data?.url) data.url = process.env.BASE_URL + data.url;
    const newUser = new User(data);
    await newUser.save();
    return newUser.toObject();
  }
  async getAll(searchTerm = '') {
    return await User.find({ role: { $ne: Roles.Lead }, name: { $regex: searchTerm, $options: 'i' } })
      .select('name url role active username')
      .sort('-createdAt');
  }
  async getDetails(_id) {
    const user = await User.findOne({ role: { $ne: Roles.Lead }, _id }).select(
      'firstName lastName mobile url role rule active username email',
    );
    if (!user) throw ErrorHandler.notFound({}, 'User not found');
    const PermissionService = require('../permission/Permission.Service');
    const permissions = await PermissionService.userPermissions(_id);
    return { ...user.toObject(), permissions };
  }
  async updateUser(_id, data) {
    // if (data?.url) data.url = process.env.BASE_URL + data.url;
    if (data?.mobile) {
      const exists = await User.findOne({ mobile: data.mobile, _id: { $ne: _id } });
      if (exists) {
        throw ErrorHandler.badRequest({ mobile: ValidationTypes.AlreadyExists }, 'Mobile number already exists');
      }
    }
    const user = await User.findOneAndUpdate({ _id }, data);
    if (!user) {
      throw ErrorHandler.notFound({}, 'User not found');
    }
    if (data?.url) {
      const fileName = path.basename(user?.url);
      if (fileName) deleteFile(`./public/media/${fileName}`);
    }

    return user.toObject();
  }
  async toggleActiveStatus(_id) {
    const user = await User.findOne({ _id, role: { $ne: Roles.Lead } });
    if (!user) throw ErrorHandler.notFound({}, 'User not found');
    const updated = await User.findOneAndUpdate({ _id, role: { $ne: Roles.Lead } }, { active: !user.active });
    if (!updated)
      throw ErrorHandler.internalServerError({}, 'An error occurred while updating the resource. Please try again later.');
    return `User is now ${updated.active ? 'inactive' : 'active'}.`;
  }
}
module.exports = new UserService();
