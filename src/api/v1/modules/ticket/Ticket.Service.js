const { default: mongoose } = require('mongoose');
const ErrorHandler = require('../../../../enums/errors');
const { TicketStatusEnum, TicketTypeEnum } = require('../../../../enums/ticket');
const LeadService = require('../lead/Lead.Service');
const Ticket = require('./Ticket.entity');
class TicketService {
  async create(data) {
    const lead = await LeadService.getDetails(data.leadId);
    const ticket = new Ticket(data);
    await ticket.save();
    if (!ticket) {
      throw ErrorHandler.badRequest('Ticket not created');
    }
    if (lead.ticketStatus === 'Done') {
      await LeadService.update(lead._id, { ticketStatus: 'Pending' });
    }
    return 'Ticket created successfully';
  }
  async createNote(data) {
    const ticket = await Ticket.findOne({ _id: data.ticketId, ticketType: TicketTypeEnum.Ticket });
    if (!ticket) {
      throw ErrorHandler.notFound('Ticket not found');
    }
    if (ticket.status === TicketStatusEnum.Resolved) {
      throw ErrorHandler.badRequest('Cannot add note to a resolved ticket');
    }
    const note = new Ticket(data);
    await note.save();
    if (!note) {
      throw ErrorHandler.badRequest('Note not created');
    }
    return 'Note created successfully';
  }

  async resolveTicket(data) {
    const ticket = await Ticket.findOne({ _id: data.ticketId, ticketType: TicketTypeEnum.Ticket });
    if (!ticket) {
      throw ErrorHandler.notFound('Ticket not found');
    }
    if (ticket.status === TicketStatusEnum.Resolved) {
      throw ErrorHandler.badRequest('Ticket already resolved');
    }
    data.content = 'تم حل المشكلة';
    const note = new Ticket(data);
    await note.save();
    if (!note) {
      throw ErrorHandler.badRequest('Not resolved');
    }
    ticket.status = TicketStatusEnum.Resolved;
    await ticket.save();

    const openTicket = await Ticket.findOne({
      leadId: ticket.leadId,
      status: TicketStatusEnum.InProgress,
      ticketType: TicketTypeEnum.Ticket,
    });
    if (!openTicket) {
      await LeadService.update(ticket.leadId, { ticketStatus: 'Done' });
    }
    return 'Ticket Resolved Successfully';
  }
  async getAll(_id) {
    const tickets = await Ticket.aggregate([
      {
        $match: {
          leadId: new mongoose.Types.ObjectId(_id),
          ticketType: TicketTypeEnum.Ticket,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
        },
      },
      {
        $unwind: '$createdBy',
      },
      {
        $lookup: {
          from: 'tickets',
          localField: '_id',
          foreignField: 'ticketId',
          as: 'notes',
        },
      },
      // {
      //   $project: {
      //     _id: 1,
      //     content: 1,
      //     status: 1,
      //     type: 1,
      //     createdBy: {
      //       _id: '$createdBy._id',
      //       name: '$createdBy.name',
      //       url: '$createdBy.url',
      //     },
      //     notes: 1,
      //   },
      // },
    ]);
    return tickets;
  }
}
module.exports = new TicketService();
