const ErrorHandler = require('../../../../../enums/errors');
const Contract = require('../entities/Contract.entity');
const ContractInstallment = require('../entities/ContractInstallment.entity');
const { VillageService } = require('../../location/services');
const { ContractPaymentMethodEnum, ContractPaidStatusEnum } = require('../../../../../enums/contract');

class ContractService {
  async create(data) {
    const LeadService = require('../../lead/Lead.Service');
    await LeadService.getDetails(data.leadId);

    const exists = await Contract.findOne({ leadId: data.leadId });
    if (exists) throw ErrorHandler.badRequest({}, 'Already have a contract');

    const village = await VillageService.getDetails(data.villageId);
    data.cityId = village.cityId;

    const contract = new Contract(data);
    await contract.save();
    if (data.paymentMethod === ContractPaymentMethodEnum.Installments) {
      data.contractInstallmentsList = data.contractInstallmentsList.map((ele, index) => {
        return {
          ...ele,
          nextInstallment: index === 0 ? true : false,
          order: index + 1,
          contractId: contract._id,
          leadId: data.leadId,
        };
      });
      await ContractInstallment.insertMany(data.contractInstallmentsList);
    }

    return 'Contract created successfully';
  }
  async getDetails(_id) {
    const contract = await Contract.findOne({ leadId: _id }).populate('cityId villageId', 'nameEn nameAr url');
    if (!contract) return null;
    const { createdBy, createdAt, leadId, numberOfInstallments, ...result } = contract.toObject();
    if (contract.paymentMethod === ContractPaymentMethodEnum.Installments) {
      const contractInstallment = await ContractInstallment.findOne({ contractId: contract._id, nextInstallment: true });
      if (contractInstallment) {
        result.installmentAmount = contractInstallment.installmentAmount;
        result.nextInstallments = contractInstallment.installmentDate;
        result.contractInstallment = {
          _id: contractInstallment._id,
          order: contractInstallment.order,
          installmentAmount: contractInstallment.installmentAmount,
        };
      }
    }
    if (result.cityId) {
      result.city = result.cityId;
      delete result.cityId;
    }
    if (result.villageId) {
      result.village = result.villageId;
      if (!result.villageId?.url) result.village.url = null;
      delete result.villageId;
    }

    return result;
  }

  async payInstallment(_id) {
    const currentInstallment = await ContractInstallment.findOne({ _id, nextInstallment: true });
    if (!currentInstallment) throw ErrorHandler.notFound({}, 'Contract installation not found');
    currentInstallment.nextInstallment = false;
    currentInstallment.status = ContractPaidStatusEnum.Done;
    await currentInstallment.save();

    const nextInstallment = await ContractInstallment.findOneAndUpdate(
      { order: currentInstallment.order + 1, leadId: currentInstallment.leadId, nextInstallment: false },
      { nextInstallment: true },
    );
    const contract = await Contract.findOne({ _id: currentInstallment.contractId });
    contract.totalPaid = Number(contract.totalPaid) + Number(currentInstallment.installmentAmount);
    contract.remainingAmount = Number(contract.remainingAmount) - Number(currentInstallment.installmentAmount);
    if (!nextInstallment) {
      contract.contractPaidStatus = ContractPaidStatusEnum.Done;
    }
    await contract.save();
    return 'Installment paid successfully';
  }
}
module.exports = new ContractService();
