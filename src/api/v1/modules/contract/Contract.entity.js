const mongoose = require('mongoose');

const contractSchema = mongoose.Schema(
  {
    paymentMethod: { type: String, trim: true },
    contractPaidStatus: { type: String, trim: true },

    totalAmount: { type: Number },
    downPayment: { type: Number },
    totalInstallments: { type: Number },
    installmentAmount: { type: Number },
    remainingAmount: { type: Number },
    totalPaid: { type: Number },

    installmentsType: { type: String },
    numberOfInstallments: { type: Number },
    installmentStartIn: { type: Date },
    installmentEndsIn: { type: Date },
    nextInstallments: { type: Date },
    contractDate: { type: Date },

    membershipType: { type: String },
    individuals: { type: Number },
    unitType: { type: String },
    startUsageWhenComplete: { type: Number },
    canReserve: { type: Boolean, default: true },

    totalNights: { type: Number },
    usageNights: { type: Number },
    remainingNights: { type: Number },
    nightsCanUse: { type: Number },

    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    villageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Village' },

    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

const Contract = mongoose.models.Contract || mongoose.model('Contract', contractSchema);
module.exports = Contract;
