const {
  ContractPaymentMethodEnum,
  ContractMembershipTypeEnum,
  installmentsTypeEnum,
  ContractPaidStatusEnum,
} = require('../../../../enums/contract');
const ErrorHandler = require('../../../../enums/errors');
const ContractService = require('./Contract.Service');
class ContractController {
  async create(req, res, next) {
    try {
      let data = req.body;
      data.createdBy = req.token.sub;
      data.totalPaid = data.totalAmount;
      data.totalNights = 100;
      data.nightsCanUse = 100;
      data.contractPaidStatus = ContractPaidStatusEnum.Done;

      if (data.membershipType === ContractMembershipTypeEnum.Dragon200) {
        data.totalNights = 200;
        data.nightsCanUse = 200;
      }
      data.remainingNights = data.totalNights;
      data.usageNights = 0;

      if (data.paymentMethod === ContractPaymentMethodEnum.Installments) {
        if (data.totalAmount <= data.downPayment)
          throw ErrorHandler.badRequest({}, 'Down payment must be less than total amount');

        // handle reservations access
        // const paidPercentage = (data.downPayment / data.totalAmount) * 100;
        // if (paidPercentage < data.startUsageWhenComplete) data.canReserve = true;

        data.nightsCanUse = Math.floor((data.downPayment / data.totalAmount) * data.totalNights);

        //handle payments
        data.contractPaidStatus = ContractPaidStatusEnum.Pending;
        data.remainingAmount = data.totalAmount - data.downPayment;
        data.totalInstallments = data.remainingAmount;
        data.totalPaid = data.downPayment;
        data.installmentAmount = data.remainingAmount / data.numberOfInstallments;

        //handle dates
        data.installmentStartIn = new Date(data.installmentStartIn);
        data.nextInstallments = data.installmentStartIn;
        //handle ends in date
        const installmentStart = new Date(data.installmentStartIn);
        const installmentEnds = new Date(installmentStart);
        const endsIn =
          data.installmentsType === installmentsTypeEnum.Monthly
            ? 1
            : data.installmentsType === installmentsTypeEnum.ThreeMonth
              ? 3
              : 6;
        installmentEnds.setMonth(installmentEnds.getMonth() + data.numberOfInstallments * endsIn);
        installmentEnds.setFullYear(installmentEnds.getFullYear(), installmentEnds.getMonth(), installmentStart.getDate());
        installmentEnds.setHours(installmentStart.getHours());
        installmentEnds.setMinutes(installmentStart.getMinutes());
        installmentEnds.setSeconds(installmentStart.getSeconds());
        installmentEnds.setMilliseconds(installmentStart.getMilliseconds());
        data.installmentEndsIn = installmentEnds;
      }
      const result = await ContractService.create(data);
      return res.sendResponse(result);
    } catch (error) {
      next(error);
    }
  }
  async getDetails(req, res, next) {
    try {
      const {
        installmentsType,
        contractPaidStatus,
        contractDate,
        membershipType,
        individuals,
        unitType,
        startUsageWhenComplete,
        canReserve,
        totalNights,
        usageNights,
        remainingNights,
        updatedAt,
        city,
        village,
        ...result
      } = await ContractService.getDetails(req.token.sub);
      return res.sendResponse(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContractController();
