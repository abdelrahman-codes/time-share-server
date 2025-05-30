const logger = require('../../../../config/logger');
const { TicketStatusEnum, TicketContentTypeEnum } = require('../../../../enums/ticket');
const TicketService = require('./Ticket.Service');
class TicketController {
  async create(req, res, next) {
    try {
      req.body.createdBy = req.token.sub;
      req.body.status = TicketStatusEnum.InProgress;
      req.body.notes = {
        content: req.body.content,
        createdBy: req.token.sub,
      };
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
      req.body.type = TicketContentTypeEnum.Note;
      const data = await TicketService.createNote(req.body);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
  async resolveTicket(req, res, next) {
    try {
      const data = await TicketService.resolveTicket({
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
  async assign(req, res, next) {
    try {
      const data = await TicketService.assign(req.body, req.currentUser);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }

  async createReservationRequest(req, res, next) {
    try {
      req.body.createdBy = req.token.sub;
      req.body.leadId = req.token.sub;
      req.body.status = TicketStatusEnum.InProgress;
      req.body.notes = {
        createdBy: req.token.sub,
      };
      const data = await TicketService.createReservationRequest(req.body);
      logger.info('New ticket created');
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TicketController();
