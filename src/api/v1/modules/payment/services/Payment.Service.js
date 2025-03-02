const ErrorHandler = require('../../../../../enums/errors');
const { PaymentStatusEnum, PaymentPayMethodEnum } = require('../../../../../enums/payment');
const ContractInstallment = require('../../contract/entities/ContractInstallment.entity');
const Contract = require('../../contract/entities/Contract.entity');
const Payment = require('../entities/Payment.entity');
const Reservation = require('../../reservation/Reservation.entity');
const { ReservationStatusEnum } = require('../../../../../enums/reservation');
const { ContractPaidStatusEnum } = require('../../../../../enums/contract');
const crypto = require('crypto');
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

    const status = await ContractService.payInstallment(contract.contractInstallment._id);

    let usage = Math.floor((Number(payment.amount) / Number(contract.totalAmount)) * Number(contract.totalNights));
    let nightsCanUse = Number(contract.nightsCanUse) + Number(usage);
    if (status === ContractPaidStatusEnum.Done) {
      nightsCanUse = contract.remainingNights;
      usage = Number(contract.remainingNights) - Number(contract.nightsCanUse);
    }
    const reservation = new Reservation({
      reservationDate: payment.createdAt,
      usage: `+${usage}`,
      usageNumber: usage,
      status: ReservationStatusEnum.Done,
      canEdit: false,
      contractId: payment.contractId,
      leadId: payment.leadId,
      createdBy: payment.createdBy,
    });
    await reservation.save();
    await Contract.findOneAndUpdate({ _id: contract._id }, { nightsCanUse });
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

  async createPaymentToken(currentUser) {
    const contractInstallment = await ContractInstallment.findOne({ leadId: currentUser._id, nextInstallment: true });
    if (!contractInstallment) throw ErrorHandler.notFound();
    const amount = contractInstallment.installmentAmount;

    // Helper function to handle fetch requests
    const fetchRequest = async (url, method, body) => {
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Fetch request failed', error);
        throw error; // Rethrow the error so it can be handled at the caller
      }
    };

    // Step 1: Authentication
    const authResponse = await fetchRequest('https://accept.paymobsolutions.com/api/auth/tokens', 'POST', {
      api_key: process.env.PAYMOB_API_KEY,
    });

    const authToken = authResponse.token;

    // Step 2: Create order
    const orderResponse = await fetchRequest('https://accept.paymobsolutions.com/api/ecommerce/orders', 'POST', {
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amount * 100,
      currency: 'EGP',
      items: [],
    });

    const orderId = orderResponse.id;

    // Step 3: Generate payment key
    const paymentKeyResponse = await fetchRequest('https://accept.paymobsolutions.com/api/acceptance/payment_keys', 'POST', {
      auth_token: authToken,
      amount_cents: amount * 100,
      expiration: 3600,
      order_id: orderId,
      billing_data: {
        apartment: 'NA',
        email: 'NA',
        floor: 'NA',
        first_name: currentUser.name,
        street: 'NA',
        building: 'NA',
        phone_number: 'NA',
        shipping_method: 'NA',
        postal_code: 'NA',
        city: 'NA',
        country: 'NA',
        last_name: 'NA',
        state: 'NA',
      },
      currency: 'EGP',
      integration_id: process.env.PAYMOB_INTEGRATION_ID,
    });

    const paymentToken = paymentKeyResponse.token;
    const payment = await Payment.create({
      leadId: currentUser._id,
      amount,
      paymentToken,
      payMethod: PaymentPayMethodEnum.Bank,
      transactionNumber: orderId,
      status: PaymentStatusEnum.Pending,
      canEdit: false,
      createdBy: currentUser._id,
      contractInstallmentId: contractInstallment._id,
      contractId: contractInstallment.contractId,
    });
    if (!payment) throw ErrorHandler.badRequest({}, 'Something went wrong please try again');
    return { paymentToken };
  }

  async transactionResponse(query) {
    if (query.success !== 'true' && query.success !== true) {
      return false;
    }
    const payment = await Payment.findOneAndUpdate({ transactionNumber: query.order }, { status: PaymentStatusEnum.Paid });
    const ContractService = require('../../contract/services/Contract.Service');
    const status = await ContractService.payInstallment(payment.contractInstallmentId);
    const contract = await Contract.findOne({ _id: payment.contractId });

    let usage = Math.floor((Number(payment.amount) / Number(contract.totalAmount)) * Number(contract.totalNights));
    let nightsCanUse = Number(contract.nightsCanUse) + Number(usage);
    if (status === ContractPaidStatusEnum.Done) {
      nightsCanUse = contract.remainingNights;
      usage = Number(contract.remainingNights) - Number(contract.nightsCanUse);
    }
    const reservation = new Reservation({
      reservationDate: payment.createdAt,
      usage: `+${usage}`,
      usageNumber: usage,
      status: ReservationStatusEnum.Done,
      canEdit: false,
      contractId: payment.contractId,
      leadId: payment.leadId,
      createdBy: payment.createdBy,
    });
    await reservation.save();
    await Contract.findOneAndUpdate({ _id: payment.contractId }, { nightsCanUse });
    return true;
  }
}
module.exports = new PaymentService();
