const logger = require('../../../../config/logger');
const { MobileAppRequestEnum } = require('../../../../enums/lead');
const Roles = require('../../../../enums/roles');
const { TicketStatusEnum } = require('../../../../enums/ticket');
const { OnlyUniqueUtility } = require('../../../../utils');
const LeadService = require('./Lead.Service');
class LeadController {
  async create(req, res, next) {
    try {
      const { password, ...result } = await LeadService.create(req.body);
      logger.info('User created');
      return res.sendResponse(result);
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      let page = req.query.page || 1,
        limit = req.query.limit || 10,
        searchTerm = req.query.searchTerm || '',
        contactMethod = req.query.contactMethod || '',
        category = req.query.category || '',
        getFrom = req.query.getFrom || '';

      const options = {
        page,
        limit,
        select: 'name url ticketStatus',
        sort: { createdAt: -1 },
      };

      let query = {
        role: Roles.Lead,
        ...(category &&
          (Array.isArray(category) ? { category: { $in: category } } : { category: { $regex: category, $options: 'i' } })),
        ...(contactMethod &&
          (Array.isArray(contactMethod)
            ? { contactMethod: { $in: contactMethod } }
            : { contactMethod: { $regex: contactMethod, $options: 'i' } })),
        ...(getFrom &&
          (Array.isArray(getFrom) ? { getFrom: { $in: getFrom } } : { getFrom: { $regex: getFrom, $options: 'i' } })),
      };

      if (searchTerm.startsWith(':')) {
        query['contract.contractNumber'] = searchTerm.slice(1);
      } else {
        query.$or = [{ name: { $regex: searchTerm, $options: 'i' } }, { mobile: { $regex: searchTerm, $options: 'i' } }];
      }

      if (Array.isArray(req.query.mobileAppRequest)) {
        let username = req.query.mobileAppRequest.filter(OnlyUniqueUtility);
        if (username.length < 2 && username[0] === MobileAppRequestEnum.HaveAccount)
          query.username = { $regex: '', $options: 'i' };
        else if (username.length < 2 && username[0] === MobileAppRequestEnum.NoAccount) query.username = null;
      } else if (req.query.mobileAppRequest) {
        let username =
          req.query.mobileAppRequest === MobileAppRequestEnum.HaveAccount ? { $regex: '', $options: 'i' } : null;
        query.username = username;
      }

      const pipeline = [
        { $lookup: { from: 'contracts', localField: '_id', foreignField: 'leadId', as: 'contract' } },
        { $match: query },
        {
          $project: {
            name: 1,
            url: 1,
            ticketStatus: 1,
          },
        },
      ];

      const data = await LeadService.getAll(pipeline, options);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }

  async getDetails(req, res, next) {
    try {
      let _id = req?.params?._id || req?.token?.sub;
      let returnContract = true;
      if (!req?.params?._id) returnContract = false;
      const data = await LeadService.getDetails(_id, returnContract);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      let _id = req.params._id || req?.token?.sub;
      const { password, ...result } = await LeadService.update(_id, req.body);
      logger.info('User updated');
      return res.sendResponse(result);
    } catch (error) {
      next(error);
    }
  }
  async createUserName(req, res, next) {
    try {
      const data = await LeadService.createUserName(req.params._id);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const data = await LeadService.resetPassword(req.params._id);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
  async homePage(req, res, next) {
    try {
      const data = await LeadService.homePage(req.token.sub);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
  async deleteAccount(req, res, next) {
    try {
      const data = await LeadService.deleteAccount(req.token.sub);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
  async updateFcmToken(req, res, next) {
    try {
      let _id = req.token.sub;
      await LeadService.update(_id, req.body);
      return res.sendResponse('Fsm Token updated successfully');
    } catch (error) {
      next(error);
    }
  }
  async contactUs(req, res, next) {
    try {
      req.body.createdBy = req.token.sub;
      req.body.leadId = req.token.sub;
      req.body.status = TicketStatusEnum.InProgress;
      req.body.notes = {
        content: req.body.message,
        createdBy: req.token.sub,
      };
      const data = await LeadService.contactUs(req.body);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LeadController();
