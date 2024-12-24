const logger = require('../../../../config/logger');
const ErrorHandler = require('../../../../enums/errors');
const User = require('./User.entity');
class UserService {
  async createUser(data) {
    const { email } = data;
    const user = await User.findOne({ email });
    if (user) {
      logger.warn(`Attempt to create a user with existing email: ${email}`);
      throw ErrorHandler.badRequest('User already exists');
    }
    const newUser = new User(data);
    return await newUser.save();
  }
  async getAll() {
    return await User.find();
  }
}
module.exports = new UserService(User);
