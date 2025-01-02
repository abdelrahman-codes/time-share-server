const logger = require('../../../../config/logger');
const LeadService = require('./Lead.Service');
class LeadController {
  async create(req, res, next) {
    try {
      console.log(req.body);
      const { password, ...result } = await LeadService.create(req.body);
      logger.info('User created');
      return res.sendResponse(result);
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      let { searchTerm } = req.query;
      if (!searchTerm) searchTerm = '';
      const data = await LeadService.getAll(searchTerm);
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
