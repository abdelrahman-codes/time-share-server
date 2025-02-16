const mongoose = require('mongoose');
const { PaymentStatusEnum } = require('../../../../../enums/payment');

const paymentSchema = mongoose.Schema(
  {
    transactionNumber: { type: String, trim: true },
    amount: { type: Number },
    payMethod: { type: String, trim: true },
    installment: { type: String, trim: true },
    canEdit: { type: Boolean, default: false },
    status: { type: String, trim: true, default: PaymentStatusEnum.Pending },
    url: { type: String, trim: true, default: null },

    contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
    contractInstallmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ContractInstallment' },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
module.exports = Payment;
