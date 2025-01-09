const mongoose = require('mongoose');
const { TicketTypeEnum } = require('../../../../enums/ticket');

const ticketSchema = mongoose.Schema(
  {
    ticketType: { type: String, trim: true, default: TicketTypeEnum.Ticket },
    content: { type: String, trim: true },
    status: { type: String, trim: true },
    type: { type: String, trim: true },
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);
const Ticket = mongoose.models.Ticket || mongoose.model(' Ticket', ticketSchema);
module.exports = Ticket;
