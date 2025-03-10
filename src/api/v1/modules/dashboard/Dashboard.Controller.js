const DashboardService = require('./Dashboard.Service');
class DashboardController {
  async getDetails(req, res, next) {
    try {
      const days = req.query?.days || null;
      const data = await DashboardService.getDetails(days);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
