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

  async getAll(req, res, next) {
    try {
      let _id = req.params._id || req.token.sub;
      const result = await PaymentService.getAll(_id);
      return res.sendResponse(result);
    } catch (error) {
      next(error);
    }
  }
  async createPaymentToken(req, res, next) {
    try {
      const result = await PaymentService.createPaymentToken(req.currentUser);
      return res.sendResponse(result);
    } catch (error) {
      next(error);
    }
  }

  async transactionResponse(req, res, next) {
    try {
      const result = await PaymentService.transactionResponse(req.query);
      if (!result) return res.redirect('https://rve-website.vercel.app/en/fail');
      return res.redirect('https://rve-website.vercel.app/en/success?operationType=buy');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
