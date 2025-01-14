const { CityService } = require('../services');
class CityController {
  async create(req, res, next) {
    try {
      const data = await CityService.create(req.body);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      req.body.cityId = req.params._id;
      const data = await CityService.update(req.body);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
  async getAll(req, res, next) {
    try {
      const data = await CityService.getAll();
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CityController();
