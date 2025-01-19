const ErrorHandler = require('../../../../enums/errors');
const Contract = require('./Contract.entity');
const { CityService, VillageService } = require('../location/services');
const LeadService = require('../lead/Lead.Service');
class ContractService {
  async create(data) {
    await LeadService.getDetails(data.leadId);

    const exists = await Contract.findOne({ leadId: data.leadId });
    if (exists) throw ErrorHandler.badRequest({}, 'Already have a contract');

    const village = await VillageService.getDetails(data.villageId);
    data.cityId = village.cityId;

    const contract = new Contract(data);
    await contract.save();
    await LeadService.update(data.leadId, { contractPaidStatus: data.contractPaidStatus });

    return 'Contract created successfully';
  }
  async getDetails(_id) {
    const contract = await Contract.findOne({ leadId: _id }).populate('cityId villageId', 'nameEn nameAr');
    if (!contract) throw ErrorHandler.notFound({}, 'Contract not found');
    const { createdBy, createdAt, leadId, numberOfInstallments, ...result } = contract.toObject();
    return result;
  }
}
module.exports = new ContractService();
