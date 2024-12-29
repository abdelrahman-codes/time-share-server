const path = require('path');
const logger = require('../../../../config/logger');
const ErrorHandler = require('../../../../enums/errors');
const Roles = require('../../../../enums/roles');
const deleteFile = require('../../../../helpers/delete-file');
const User = require('./User.entity');
class UserService {
  async createUser(data) {
    const user = await User.findOne({ $or: [{ username: data.username.toLowerCase() }, { mobile: data.mobile }] });
    if (user) {
      if (user.username === data.username.toLowerCase()) {
        logger.warn(`Attempt to create a user with existing username: ${data.username}`);
        throw ErrorHandler.badRequest('Username already exists');
      }
      logger.warn(`Attempt to create a user with existing mobile: ${data.mobile}`);
      throw ErrorHandler.badRequest('Mobile number already exists');
    }
    data.username = data.username.toLowerCase();
    if (data?.pic) data.url = process.env.BASE_URL + data.pic;
    const newUser = new User(data);
    await newUser.save();
    return newUser.toObject();
  }
  async getAll(searchTerm = '') {
    return await User.find({ role: { $ne: Roles.User }, name: { $regex: searchTerm, $options: 'i' } })
      .select('name url role active username')
      .sort('-createdAt');
  }
  async getDetails(_id) {
    const user = await User.findOne({ role: { $ne: Roles.User }, _id })
      .select('firstName lastName mobile url role rule active username email')
      .sort('-createdAt');
    if (!user) throw ErrorHandler.notFound('User not found');
    return user;
  }
  async updateUser(_id, data) {
    if (data?.pic) data.url = process.env.BASE_URL + data.pic;
    if (data?.mobile) {
      const exists = await User.findOne({ mobile: data.mobile, _id: { $ne: _id } });
      if (exists) {
        throw ErrorHandler.badRequest('Mobile number already exists');
      }
    }
    const user = await User.findOneAndUpdate({ _id }, data);
    if (!user) {
      throw ErrorHandler.notFound('User not found');
    }
    if (data?.pic) {
      const fileName = path.basename(user?.url);
      if (fileName) deleteFile(`./public/media/${fileName}`);
    }

    return user.toObject();
  }
}
module.exports = new UserService(User);
