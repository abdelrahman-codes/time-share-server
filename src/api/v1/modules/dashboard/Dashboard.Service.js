const { date } = require('joi');
const { PaymentStatusEnum } = require('../../../../enums/payment');
const { ReservationStatusEnum } = require('../../../../enums/reservation');
const { ContractPaymentMethodEnum } = require('../../../../enums/contract');
const Contract = require('../contract/entities/Contract.entity');
const ContractInstallment = require('../contract/entities/ContractInstallment.entity');
const Payment = require('../payment/entities/Payment.entity');
const Reservation = require('../reservation/Reservation.entity');
class DashboardService {
  async getDetails(days) {
    let query = {},
      paymentQuery = { status: PaymentStatusEnum.Paid },
      reservationQuery = { status: ReservationStatusEnum.Done },
      contractInstallmentQuery = { nextInstallment: true };
    if (days) {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Number(days));
      query = { createdAt: { $gte: startDate, $lte: today } };
      paymentQuery.createdAt = { $gte: startDate, $lte: today };
      reservationQuery.reservationDate = { $gte: startDate, $lte: today };
      contractInstallmentQuery.installmentDate = { $gte: startDate, $lte: today };
    }

    const totalContract = await Contract.countDocuments(query);
    const contracts = await Contract.find(
      { paymentMethod: ContractPaymentMethodEnum.Installments, ...query },
      { totalAmount: 1, downPayment: 1 },
    );
    const cashContracts = await Contract.find(
      { paymentMethod: ContractPaymentMethodEnum.Cash, ...query },
      { totalAmount: 1 },
    );
    const totalCashContractAmount = cashContracts.reduce((sum, contract) => sum + contract.totalAmount, 0);
    const totalContractAmount = contracts.reduce((sum, contract) => sum + contract.totalAmount, 0) + totalCashContractAmount; // Sum all contract amounts
    const totalDownPaymentAmount = contracts.reduce((sum, contract) => sum + contract.downPayment, 0);

    const payments = await Payment.find(paymentQuery, { amount: 1 });
    const totalPaid =
      payments.reduce((sum, payment) => sum + payment.amount, 0) + totalCashContractAmount + totalDownPaymentAmount;

    const totalRemainingAmount = Math.max(0, totalContractAmount - totalPaid);

    const reservationLogs = await Reservation.aggregate([
      { $match: reservationQuery },
      { $sort: { reservationDate: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: 'leadId',
          foreignField: '_id',
          as: 'leadDetails',
        },
      },
      { $unwind: '$leadDetails' },
      {
        $project: {
          lead: {
            _id: '$leadDetails._id',
            name: '$leadDetails.name',
            url: '$leadDetails.url',
          },
          date: '$reservationDate',
          location: 1,
        },
      },
    ]);

    const installmentLogs = await ContractInstallment.aggregate([
      { $match: contractInstallmentQuery },
      { $sort: { installmentDate: 1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: 'leadId',
          foreignField: '_id',
          as: 'leadDetails',
        },
      },
      { $unwind: '$leadDetails' },
      {
        $project: {
          lead: {
            _id: '$leadDetails._id',
            name: '$leadDetails.name',
            url: '$leadDetails.url',
          },
          date: '$installmentDate',
          installmentAmount: 1,
        },
      },
    ]);

    return {
      totalContract,
      totalContractAmount,
      totalPaid,
      totalRemainingAmount,
      reservationLogs,
      installmentLogs,
    };
  }
}
module.exports = new DashboardService();
