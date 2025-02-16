const {
  ContractPaymentMethodEnum,
  ContractMembershipTypeEnum,
  installmentsTypeEnum,
  ContractPaidStatusEnum,
} = require('../../../../../enums/contract');
const ErrorHandler = require('../../../../../enums/errors');
const ContractService = require('../services/Contract.Service');
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

        data.nightsCanUse = Math.floor((data.downPayment / data.totalAmount) * data.totalNights);

        //handle payments
        data.contractPaidStatus = ContractPaidStatusEnum.Pending;
        data.remainingAmount = data.totalAmount - data.downPayment;
        data.totalInstallments = data.remainingAmount;
        data.totalPaid = data.downPayment;

        if (data?.contractInstallmentsList) {
          let totalInstallments = 0;
          data.contractInstallmentsList.forEach((ele, index) => {
            if (index === 0) {
              data.installmentStartIn = new Date(ele.installmentDate);
            }
            if (data.contractInstallmentsList.length - index === 1) {
              data.installmentEndsIn = new Date(ele.installmentDate);
            }
            totalInstallments += Number(ele.installmentAmount);
          });
          if (totalInstallments !== data.remainingAmount)
            throw ErrorHandler.badRequest(
              {},
              `The total sum of installment amounts (${totalInstallments}) does not match the expected remaining amount (${data.remainingAmount}). Please verify your calculations.`,
            );
        } else {
          //handle dates
          data.installmentStartIn = new Date(data.installmentStartIn);
          data.nextInstallment = new Date(data.installmentStartIn);
         
          //handle ends in date
          const endsIn =
            data.installmentsType === installmentsTypeEnum.Monthly
              ? 1
              : data.installmentsType === installmentsTypeEnum.ThreeMonth
                ? 3
                : 6;

          data.contractInstallmentsList = [];
          const installmentAmount = data.remainingAmount / data.numberOfInstallments;

          for (let i = 0; i < data.numberOfInstallments; i++) {
            data.contractInstallmentsList.push({
              installmentAmount,
              installmentDate: new Date(data.nextInstallment),
              status: ContractPaidStatusEnum.Pending,
            });

            if (data.numberOfInstallments - i === 1) {
              data.installmentEndsIn = new Date(data.nextInstallment);
            }

            let nextDate = new Date(data.nextInstallment);
            nextDate.setMonth(nextDate.getMonth() + endsIn);

            // Ensure all time properties remain consistent
            data.nextInstallment = new Date(
              nextDate.getFullYear(),
              nextDate.getMonth(),
              nextDate.getDate(),
              nextDate.getHours(),
              nextDate.getMinutes(),
              nextDate.getSeconds(),
              nextDate.getMilliseconds(),
            );
          }
        }
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
