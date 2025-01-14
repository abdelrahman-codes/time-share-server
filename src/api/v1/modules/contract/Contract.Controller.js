const logger = require('../../../../config/logger');
const { ContractPaymentMethodEnum } = require('../../../../enums/contract');
const ErrorHandler = require('../../../../enums/errors');
const ContractService = require('./Contract.Service');
class ContractController {
  async create(req, res, next) {
    try {
      let data = req.body;
      data.createdBy = req.token.sub;
      if (data.paymentMethod === ContractPaymentMethodEnum.Installments) {
        if (data.totalAmount <= data.downPayment)
          throw ErrorHandler.badRequest({}, 'Down payment must be less than total amount');
        data.remainingAmount = data.totalAmount - data.downPayment;

        data.installmentStartIn = new Date(data.installmentStartIn);

        // Create a new Date object for the end date
        const installmentStart = new Date(data.installmentStartIn);
        const installmentEnds = new Date(installmentStart);

        // Add the number of months
        installmentEnds.setMonth(installmentEnds.getMonth() + data.numberOfInstallments);

        // Explicitly set the same time as the start date
        installmentEnds.setFullYear(installmentEnds.getFullYear(), installmentEnds.getMonth(), installmentStart.getDate());
        installmentEnds.setHours(installmentStart.getHours());
        installmentEnds.setMinutes(installmentStart.getMinutes());
        installmentEnds.setSeconds(installmentStart.getSeconds());
        installmentEnds.setMilliseconds(installmentStart.getMilliseconds());

        // Assign the calculated end date
        data.installmentEndsIn = installmentEnds;

        data.installmentAmount = data.remainingAmount / data.numberOfInstallments;
      }
      const result = await ContractService.create(data);
      return res.sendResponse(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContractController();
