const mongoose = require('mongoose');
const { TicketTypeEnum } = require('../../../../enums/ticket');

const ticketSchema = mongoose.Schema(
  {
    type: { type: String, trim: true },
    status: { type: String, trim: true },
    notes:[
      {
        content: { type: String, trim: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      }
    ],
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);
const Ticket = mongoose.models.Ticket || mongoose.model(' Ticket', ticketSchema);
module.exports = Ticket;
