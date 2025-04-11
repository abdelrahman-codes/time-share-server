const path = require('path');
const bcrypt = require('bcrypt');
const logger = require('../../../../config/logger');
const ErrorHandler = require('../../../../enums/errors');
const Roles = require('../../../../enums/roles');
const deleteFile = require('../../../../helpers/delete-file');
const User = require('../user/User.entity');
const Ticket = require('../ticket/Ticket.entity');
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
const { ContractPaymentMethodEnum } = require('../../../../enums/contract');
const { notificationTypeEnum } = require('../../../../enums/notification');
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
    // if (data?.url) data.url = process.env.BASE_URL + data.url;
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
      const ContractService = require('../contract/services/Contract.Service');
      result.contract = await ContractService.getDetails(user._id);
    }
    return result;
  }
  async update(_id, data) {
    const user = await this.getDetails(_id);
    // if (data?.url) data.url = process.env.BASE_URL + data.url;
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
    if (data?.password) {
      data.password = await bcrypt.hash(data.password, Number(process.env.SALT_ROUNDS));
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
  async createUserName(_id) {
    const user = await User.findOne({ _id, role: Roles.Lead });
    if (!user) throw ErrorHandler.notFound();
    if (user.username) throw ErrorHandler.dynamicError(409, 'This user already has a username assigned.');
    if (!user.firstName)
      throw ErrorHandler.badRequest({}, 'First Name Missing: Please provide a first name for this user to proceed.');
    if (!user.lastName)
      throw ErrorHandler.badRequest({}, 'Last Name Missing: Please provide a last name for this user to proceed.');

    const ContractService = require('../contract/services/Contract.Service');
    const hasContract = await ContractService.getDetails(_id);
    if (!hasContract)
      throw ErrorHandler.badRequest(
        {},
        'A contract is required to generate a username for this lead. Please ensure the lead has an associated contract.',
      );
    const userCount = await User.countDocuments({});

    const username =
      user.firstName.replace(/\s+/g, '').toLowerCase() + user.lastName.replace(/\s+/g, '').toLowerCase() + (userCount + 1);
    user.username = username;
    await user.save();

    return {
      message: 'Username generated successfully',
      username,
    };
  }

  async resetPassword(_id) {
    const user = await User.findOne({ _id, role: Roles.Lead });
    if (!user) throw ErrorHandler.notFound();

    if (!user.firstName)
      throw ErrorHandler.badRequest({}, 'First Name Missing: Please provide a first name for this user to proceed.');
    if (!user.lastName)
      throw ErrorHandler.badRequest({}, 'Last Name Missing: Please provide a last name for this user to proceed.');

    const mobile = user.mobile.startsWith('+') ? user.mobile.slice(1) : user.mobile;
    const defaultPassword =
      user.firstName.replace(/\s+/g, '').charAt(0) + user.lastName.replace(/\s+/g, '').charAt(0) + mobile;

    user.password = defaultPassword;

    await user.save();

    return {
      message: 'Password updated successfully',
      password: defaultPassword,
    };
  }
  async homePage(_id) {
    const user = await this.getDetails(_id, true);
    const data = {
      _id: user._id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      url: user.url || null,
      totalNights: user.contract.totalNights,
      usageNights: user.contract.usageNights,
      remainingNights: user.contract.remainingNights,
      nightsCanUse: user.contract.nightsCanUse,
    };
    if (user.contract.paymentMethod === ContractPaymentMethodEnum.Installments) {
      data.nextInstallments = user.contract.nextInstallments;
      data.installmentAmount = user.contract.installmentAmount;
    }
    return data;
  }
  async deleteAccount(_id) {
    const user = await User.findOneAndDelete({ _id, role: Roles.Lead });
    if (!user) throw ErrorHandler.unauthorized();
    return 'User deleted successfully';
  }
  async contactUs(data) {
    const NotificationService = require('../notification/Notification.Service');
    await User.findOneAndUpdate({ _id: data.leadId }, { ticketStatus: TicketStatusEnum.Pending });
    const ticket = new Ticket(data);
    await ticket.save();
    const notification = {
      type: notificationTypeEnum.ContactRequest,
      message: `New contact Request`,
      refPage: `/leads/${data.leadId}`,
      sender: data.leadId,
      forAllAdmins: true,
    };
    await NotificationService.create(notification);
    return "Sent successfully";
  }
}
module.exports = new LeadService();
