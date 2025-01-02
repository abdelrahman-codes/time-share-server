const path = require('path');
const logger = require('../../../../config/logger');
const ErrorHandler = require('../../../../enums/errors');
const Roles = require('../../../../enums/roles');
const deleteFile = require('../../../../helpers/delete-file');
const User = require('../user/User.entity');
const {
  TicketStatusEnum,
  NationalityEnum,
  ContactMethodEnum,
  GetFromEnum,
  UserCategoryEnum,
} = require('../../../../enums/lead');
const { GenerateRandomString } = require('../../../../utils');
class LeadService {
  async create(data) {
    const user = await User.findOne({ mobile: data.mobile });
    if (user) {
      logger.warn(`Attempt to create a user with existing mobile: ${data.mobile}`);
      throw ErrorHandler.badRequest('Mobile number already exists');
    }
    if (data?.pic) data.url = process.env.BASE_URL + data.pic;
    data.ticketStatus = TicketStatusEnum.Done;
    data.password = GenerateRandomString(8);
    if (!data.nationality) data.nationality = NationalityEnum.Egyptian;
    if (!data.contactMethod) data.contactMethod = ContactMethodEnum.Manual;
    if (!data.getFrom) data.getFrom = GetFromEnum.Manual;
    if (!data.category) data.category = UserCategoryEnum.UnKnown;
    if (!data.address) data.address = null;
    if (!data.whatsappMobileNumber) data.whatsappMobileNumber = null;
    const lead = new User(data);
    await lead.save();
    return lead.toObject();
  }
  async getAll(searchTerm = '') {
    return await User.find({ role: { $ne: Roles.Lead }, name: { $regex: searchTerm, $options: 'i' } })
      .select('name url role active username')
      .sort('-createdAt');
  }
  async getDetails(_id) {
    const user = await User.findOne({ role: { $ne: Roles.Lead }, _id })
      .select('firstName lastName mobile url role rule active username email')
      .sort('-createdAt');
    if (!user) throw ErrorHandler.notFound('User not found');
    return user;
  }
  async update(_id, data) {
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
module.exports = new LeadService();
