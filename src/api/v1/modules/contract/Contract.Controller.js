const { ContractPaymentMethodEnum, ContractMembershipTypeEnum } = require('../../../../enums/contract');
const ErrorHandler = require('../../../../enums/errors');
const ContractService = require('./Contract.Service');
class ContractController {
  async create(req, res, next) {
    try {
      let data = req.body;
      data.createdBy = req.token.sub;
      data.totalPaid = data.totalAmount;
      data.totalNights = 150;

      if (data.membershipType === ContractMembershipTypeEnum.Dragon250) data.totalNights = 250;
      data.remainingNights = data.totalNights;
      data.usageNights = 0;

      if (data.paymentMethod === ContractPaymentMethodEnum.Installments) {
        if (data.totalAmount <= data.downPayment)
          throw ErrorHandler.badRequest({}, 'Down payment must be less than total amount');

        // handle reservations access
        const paidPercentage=(data.downPayment / data.totalAmount)*100;
        if(paidPercentage<data.startUsageWhenComplete)data.canReserve=false;

        //handle payments
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
        installmentEnds.setMonth(installmentEnds.getMonth() + data.numberOfInstallments);
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
      const data = await ContractService.getDetails(req.params._id);
      return res.sendResponse(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContractController();
