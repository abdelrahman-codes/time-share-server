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
const { PaginateHelper } = require('../../../../helpers');
const { ValidationTypes } = require('../../../../enums/error-types');
class LeadService {
  async create(data) {
    const user = await User.findOne({ mobile: data.mobile });
    if (user) {
      logger.warn(`Attempt to create a user with existing mobile: ${data.mobile}`);
      throw ErrorHandler.badRequest({ mobile: ValidationTypes.AlreadyExists }, 'Mobile number already exists');
    }
    if (data.nationalId) {
      const nationalIdExists = await User.findOne({ nationalId: data.nationalId });
      if (nationalIdExists) {
        logger.warn(`Attempt to create a user with existing nationalId: ${data.nationalId}`);
        throw ErrorHandler.badRequest({ nationalId: ValidationTypes.AlreadyExists }, 'National id already exists');
      }
    }
    if (data?.url) data.url = process.env.BASE_URL + data.url;
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
  async getAll(query, options) {
    return await PaginateHelper(User, query, options);
  }
  async getDetails(_id, returnContract = false) {
    const user = await User.findOne({ role: Roles.Lead, _id });
    if (!user) throw ErrorHandler.notFound({}, 'User not found');
    const { password, forgetPassword, emailVerified, otp, ...result } = user.toObject();
    if (returnContract) {
      const ContractService = require('../contract/Contract.Service');
      result.contract = await ContractService.getDetails(user._id);
    }
    return result;
  }
  async update(_id, data) {
    const user = await this.getDetails(_id);
    if (data?.url) data.url = process.env.BASE_URL + data.url;
    if (data?.mobile) {
      const exists = await User.findOne({ mobile: data.mobile, _id: { $ne: _id } });
      if (exists) {
        throw ErrorHandler.badRequest({ mobile: ValidationTypes.AlreadyExists }, 'Mobile number already exists');
      }
    }
    if (data?.nationalId) {
      const nationalIdExists = await User.findOne({ nationalId: data.nationalId, _id: { $ne: _id } });
      if (nationalIdExists) {
        throw ErrorHandler.badRequest({ nationalId: ValidationTypes.AlreadyExists }, 'National id already exists');
      }
    }

    const updatedUser = await User.updateOne({ _id, role: Roles.Lead }, data);
    if (updatedUser.matchedCount === 0)
      throw ErrorHandler.dynamicError(
        400,
        'Update failed: No matching lead was found to update. Please verify the lead ID or query parameters.',
      );

    if (data?.url) {
      const fileName = path.basename(user?.url);
      if (fileName) deleteFile(`./public/media/${fileName}`);
    }
    return await this.getDetails(_id);
  }
}
module.exports = new LeadService();
