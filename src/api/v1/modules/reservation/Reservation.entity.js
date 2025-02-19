const mongoose = require('mongoose');
const { ReservationStatusEnum } = require('../../../../enums/reservation');
const reservationSchema = mongoose.Schema(
  {
    reservationDate: { type: Date },
    usage: { type: String },
    usageNumber: { type: Number },
    status: { type: String, default: ReservationStatusEnum.Done },
    canEdit: { type: Boolean, default: false },
    location: { type: String, default: 'Available Credit to Use' },

    villageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Village' },
    contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
