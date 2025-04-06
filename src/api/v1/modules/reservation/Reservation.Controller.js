const ReservationService = require('./Reservation.Service');
class ReservationController {
  async getAll(req, res, next) {
    try {
      const _id = req.params._id || req.token.sub;
      let forMobile = true;
      if (req?.params?._id) forMobile = false;
      const data = await ReservationService.getAll(_id, forMobile);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
  async create(req, res, next) {
    try {
      req.body.createdBy = req.token.sub;
      const data = await ReservationService.create(req.body);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
  async cancel(req, res, next) {
    try {
      const data = {
        createdBy: req.token.sub,
        _id: req.params._id,
      };
      const result = await ReservationService.cancel(data);
      return res.sendResponse(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReservationController();
