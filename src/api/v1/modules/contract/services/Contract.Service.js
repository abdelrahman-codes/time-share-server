const ErrorHandler = require('../../../../../enums/errors');
const Contract = require('../entities/Contract.entity');
const ContractInstallment = require('../entities/ContractInstallment.entity');
const { VillageService } = require('../../location/services');
const { ContractPaymentMethodEnum } = require('../../../../../enums/contract');

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
    const contract = await Contract.findOne({ leadId: _id }).populate('cityId villageId', 'nameEn nameAr');
    if (!contract) return null;
    const { createdBy, createdAt, leadId, numberOfInstallments, ...result } = contract.toObject();
    if (contract.paymentMethod === ContractPaymentMethodEnum.Installments) {
      const contractInstallment = await ContractInstallment.findOne({ contractId: contract._id, nextInstallment: true });
      if (contractInstallment) {
        result.installmentAmount = contractInstallment.installmentAmount;
        result.nextInstallments = contractInstallment.installmentDate;
      }
    }
    if (result.cityId) {
      result.city = result.cityId;
      delete result.cityId;
    }
    if (result.villageId) {
      result.village = result.villageId;
      delete result.villageId;
    }

    return result;
  }
}
module.exports = new ContractService();
