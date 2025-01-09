const logger = require('../../../../config/logger');
const { TicketTypeEnum, TicketStatusEnum } = require('../../../../enums/ticket');
const TicketService = require('./Ticket.Service');
class TicketController {
  async create(req, res, next) {
    try {
      req.body.createdBy = req.token.sub;
      req.body.status = TicketStatusEnum.InProgress;
      const data = await TicketService.create(req.body);
      logger.info('New ticket created');
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
  async createNote(req, res, next) {
    try {
      req.body.createdBy = req.token.sub;
      req.body.ticketType = TicketTypeEnum.Note;
      const data = await TicketService.createNote(req.body);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
  async resolveTicket(req, res, next) {
    try {
      const data = await TicketService.resolveTicket({
        ticketType: TicketTypeEnum.Note,
        ticketId: req.params._id,
        createdBy: req.token.sub,
        resolvedBy: req.token.sub,
      });
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await TicketService.getAll(req.params._id);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TicketController();
