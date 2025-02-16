const PaymentService = require('../services/Payment.Service');
class PaymentController {
  async create(req, res, next) {
    try {
      req.body.createdBy = req.token.sub;
      const result = await PaymentService.create(req.body);
      return res.sendResponse(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
