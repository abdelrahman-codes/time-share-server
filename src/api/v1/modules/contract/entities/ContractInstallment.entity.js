const mongoose = require('mongoose');

const contractInstallmentSchema = mongoose.Schema(
  {
    order: { type: Number },
    status: { type: String, trim: true, default: 'Pending' },
    nextInstallment: { type: Boolean, default: false },
    installmentDate: { type: Date },
    installmentAmount: { type: Number },
    isNotifiedFiveDays: { type: Boolean, default: false },
    isNotifiedOneDay: { type: Boolean, default: false },
    isNotifiedSameDay: { type: Boolean, default: false },

    contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

const ContractInstallment =
  mongoose.models.ContractInstallment || mongoose.model('ContractInstallment', contractInstallmentSchema);
module.exports = ContractInstallment;
