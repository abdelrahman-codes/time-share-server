const ErrorHandler = require('../../../../../enums/errors');
const { PaymentStatusEnum, PaymentPayMethodEnum } = require('../../../../../enums/payment');
const ContractInstallment = require('../../contract/entities/ContractInstallment.entity');
const Payment = require('../entities/Payment.entity');

class PaymentService {
  async create(data) {
    const LeadService = require('../../lead/Lead.Service');
    await LeadService.getDetails(data.leadId);

    const ContractService = require('../../contract/services/Contract.Service');
    const contract = await ContractService.getDetails(data.leadId);
    if (!contract) throw ErrorHandler.notFound({}, 'Contract not found');
    if (!contract.contractInstallment) {
      throw ErrorHandler.badRequest({}, 'Contract already paid');
    }
    data.payMethod = PaymentPayMethodEnum.Cash;
    data.contractId = contract._id;
    data.contractInstallmentId = contract.contractInstallment._id;
    data.status = PaymentStatusEnum.Paid;
    if (Number(data.amount) !== Number(contract.contractInstallment.installmentAmount))
      throw ErrorHandler.badRequest(
        {},
        `Invalid installment amount. Expected ${contract.contractInstallment.installmentAmount}, but received ${data.amount}.`,
      );

    const payment = new Payment(data);
    await payment.save();
    if (!payment) throw ErrorHandler.badRequest({}, 'Payment not created');

    await ContractService.payInstallment(contract.contractInstallment._id);

    return 'Payment created successfully';
  }
  async getAll(leadId) {
    const payments = await Payment.find({ leadId, status: PaymentStatusEnum.Paid })
      .populate('createdBy', 'name url')
      .select('transactionNumber amount payMethod canEdit createdBy createdAt')
      .sort('-createdAt');
    if (!payments) throw ErrorHandler.notFound({}, 'No payments found');
    return payments;
  }
}
module.exports = new PaymentService();
