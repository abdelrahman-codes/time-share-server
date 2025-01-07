const logger = require('../../../../config/logger');
const { MobileAppRequestEnum } = require('../../../../enums/lead');
const Roles = require('../../../../enums/roles');
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

      let query = {
        role: Roles.Lead,
        name: { $regex: searchTerm, $options: 'i' },
        ...(category &&
          (Array.isArray(category) ? { category: { $in: category } } : { category: { $regex: category, $options: 'i' } })),
        ...(contactMethod &&
          (Array.isArray(contactMethod)
            ? { contactMethod: { $in: contactMethod } }
            : { contactMethod: { $regex: contactMethod, $options: 'i' } })),
        ...(getFrom &&
          (Array.isArray(getFrom) ? { getFrom: { $in: getFrom } } : { getFrom: { $regex: getFrom, $options: 'i' } })),
      };

      if (Array.isArray(req.query.mobileAppRequest)) {
        let username = req.query.mobileAppRequest.filter(OnlyUniqueUtility);
        if (username.length < 2 && username[0] === MobileAppRequestEnum.HaveAccount)
          query.username = { $regex: '', $options: 'i' };
        else if (username.length < 2 && username[0] === MobileAppRequestEnum.NoAccount) query.username = null;
        console.log(username);
      } else if (req.query.mobileAppRequest) {
        let username =
          req.query.mobileAppRequest === MobileAppRequestEnum.HaveAccount ? { $regex: '', $options: 'i' } : null;
        query.username = username;
      }

      const options = {
        page,
        limit,
        select: 'name url ticketStatus',
        sort: '-createdAt',
      };

      const data = await LeadService.getAll(query, options);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }

  async getDetails(req, res, next) {
    try {
      let _id = req?.params?._id || req?.token?.sub;
      const data = await LeadService.getDetails(_id);
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
}

module.exports = new LeadController();
