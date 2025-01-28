const { default: mongoose } = require('mongoose');
const ErrorHandler = require('../../../../enums/errors');
const { TicketStatusEnum } = require('../../../../enums/ticket');
const LeadService = require('../lead/Lead.Service');
const NotificationService = require('../notification/Notification.Service');
const Ticket = require('./Ticket.entity');
const { notificationTypeEnum } = require('../../../../enums/notification');
class TicketService {
  async create(data) {
    const lead = await LeadService.getDetails(data.leadId);
    const ticket = new Ticket(data);
    await ticket.save();
    if (!ticket) {
      throw ErrorHandler.badRequest({}, 'Ticket not created');
    }
    if (lead.ticketStatus === 'Done') {
      await LeadService.update(lead._id, { ticketStatus: 'Pending' });
    }
    return 'Ticket created successfully';
  }
  async createNote(data) {
    const ticket = await Ticket.findOne({ _id: data.ticketId });
    if (!ticket) {
      throw ErrorHandler.notFound({}, 'Ticket not found');
    }
    if (ticket.status === TicketStatusEnum.Resolved) {
      throw ErrorHandler.badRequest({}, 'Cannot add note to a resolved ticket');
    }
    ticket.notes.push(data);
    await ticket.save();
    return 'Note created successfully';
  }

  async resolveTicket(data) {
    const ticket = await Ticket.findOne({ _id: data.ticketId });
    if (!ticket) {
      throw ErrorHandler.notFound({}, 'Ticket not found');
    }
    if (ticket.status === TicketStatusEnum.Resolved) {
      throw ErrorHandler.badRequest({}, 'Ticket already resolved');
    }
    ticket.status = TicketStatusEnum.Resolved;
    data.content = 'تم حل المشكلة';
    ticket.notes.push(data);
    await ticket.save();
    const openTicket = await Ticket.findOne({
      leadId: ticket.leadId,
      status: TicketStatusEnum.InProgress,
    });
    if (!openTicket) {
      await LeadService.update(ticket.leadId, { ticketStatus: 'Done' });
    }
    return 'Ticket Resolved Successfully';
  }
  async getAll(_id) {
    const tickets = await Ticket.aggregate([
      { $match: { leadId: new mongoose.Types.ObjectId(_id) } },
      { $unwind: '$notes' },
      { $lookup: { from: 'users', localField: 'notes.createdBy', foreignField: '_id', as: 'createdByUser' } },
      { $lookup: { from: 'users', localField: 'notes.resolvedBy', foreignField: '_id', as: 'resolvedByUser' } },
      {
        $project: {
          _id: 1,
          type: 1,
          status: 1,
          createdAt: 1,
          'notes._id': 1,
          'notes.content': 1,
          'notes.createdAt': 1,
          'createdByUser._id': 1,
          'createdByUser.name': 1,
          'createdByUser.url': 1,
          'resolvedByUser._id': 1,
          'resolvedByUser.name': 1,
          'resolvedByUser.url': 1,
        },
      },
      {
        $group: {
          _id: '$_id',
          type: { $first: '$type' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
          notes: {
            $push: {
              _id: '$notes._id',
              content: '$notes.content',
              createdAt: '$notes.createdAt',
              createdBy: { $arrayElemAt: ['$createdByUser', 0] },
              resolvedBy: { $arrayElemAt: ['$resolvedByUser', 0] },
            },
          },
        },
      },
      {
        $addFields: {
          sortKey: {
            $switch: {
              branches: [
                { case: { $eq: ['$status', TicketStatusEnum.InProgress] }, then: 1 },
                { case: { $eq: ['$status', TicketStatusEnum.Resolved] }, then: 2 },
              ],
            },
          },
        },
      },
      { $sort: { sortKey: 1, createdAt: -1 } },
      { $project: { sortKey: 0 } },
    ]);
    return tickets;
  }
  async assign(data, currentUser) {
    const ticket = await Ticket.findOne({ _id: data.ticketId });
    if (!ticket) throw ErrorHandler.notFound();
    if (ticket.status === TicketStatusEnum.Resolved) {
      throw ErrorHandler.badRequest({}, 'Cannot assign to a resolved ticket');
    }
    const UserService = require('../user/User.Service');
    await UserService.updateUser(data.userId, { newNotification: true });

    const notification = {
      type: notificationTypeEnum.AssignedTicket,
      message: `${currentUser.name} sent you ticket Number ${ticket._id}`,
      refPage: `/leads/${ticket.leadId}`,
      sender: currentUser._id,
      receivers: data.userId,
    };
    await NotificationService.create(notification);
    return 'Ticket assigned successfully';
  }
}
module.exports = new TicketService();
