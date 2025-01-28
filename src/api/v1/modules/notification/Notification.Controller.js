const NotificationService = require('./Notification.Service');
class NotificationController {
  async getAll(req, res, next) {
    try {
      let isAdmin = false;
      if (req.path.includes('/dashboard')) isAdmin = true;
      let page = req.query.page || 1,
        limit = req.query.limit || 10;
      const data = await NotificationService.getAll(req.token.sub, isAdmin, page, limit);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
