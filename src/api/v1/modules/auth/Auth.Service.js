const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../../../../enums/errors');
const User = require('../user/User.entity');
class UserService {
  async dashboardLogin(data) {
    const user = await User.findOne({ username: data.username.toLowerCase() });
    if (!user) {
      throw ErrorHandler.notFound();
    }
    if (!(await bcrypt.compare(data.password, user.password))) {
      throw ErrorHandler.unauthorized('Invalid credentials');
    }
    const access_token = jwt.sign({ role: user.role, sub: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '12h' });
    const { password, ...result } = user.toObject();
    return {
      access_token,
      user: result,
    };
  }
}
module.exports = new UserService(User);
