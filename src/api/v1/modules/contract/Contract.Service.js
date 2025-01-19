const ErrorHandler = require('../../../../enums/errors');
const Contract = require('./Contract.entity');
const { VillageService } = require('../location/services');

class ContractService {
  async create(data) {
    const LeadService = require('../lead/Lead.Service');
    await LeadService.getDetails(data.leadId);

    const exists = await Contract.findOne({ leadId: data.leadId });
    if (exists) throw ErrorHandler.badRequest({}, 'Already have a contract');

    const village = await VillageService.getDetails(data.villageId);
    data.cityId = village.cityId;

    const contract = new Contract(data);
    await contract.save();

    return 'Contract created successfully';
  }
  async getDetails(_id) {
    const contract = await Contract.findOne({ leadId: _id }).populate('cityId villageId', 'nameEn nameAr');
    if (!contract) return null;
    const { createdBy, createdAt, leadId, numberOfInstallments, ...result } = contract.toObject();
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
