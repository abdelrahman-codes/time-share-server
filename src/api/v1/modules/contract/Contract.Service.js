const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../../../../enums/errors');
const Contract = require('./Contract.entity');
const { AccessLevelEnum, LeadFeatureEnum, ModuleEnum } = require('../../../../enums/permission');
const { CityService, VillageService } = require('../location/services');
const LeadService = require('../lead/Lead.Service');
class ContractService {
  async create(data) {
    await LeadService.getDetails(data.leadId);

    const exists = await Contract.findOne({ leadId: data.leadId });
    if (exists) throw ErrorHandler.badRequest({}, 'Already have a contract');

    const city = await CityService.getDetails(data.cityId);
    const village = await VillageService.getDetails(data.villageId);
    if (village.cityId.toString() !== city._id.toString())
      throw ErrorHandler.badRequest({}, 'This village does not belong to this city');

    const contract = new Contract(data);
    await contract.save();

    return 'Contract created successfully';
  }
}
module.exports = new ContractService();
