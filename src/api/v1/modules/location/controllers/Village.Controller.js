const { VillageService } = require('../services');
class VillageController {
  async create(req, res, next) {
    try {
      const data = await VillageService.create(req.body);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      req.body.villageId = req.params._id;
      const data = await VillageService.update(req.body);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
  async getAll(req, res, next) {
    try {
      const data = await VillageService.getAll(req.params._id);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VillageController();
