const ErrorHandler = require('../../../../../enums/errors');
const { ValidationTypes } = require('../../../../../enums/error-types');
const { Village } = require('../entities');
const CityService = require('./City.Service');
class VillageService {
  async create(data) {
    const city = await CityService.getDetails(data.cityId);
    if (!city) throw ErrorHandler.notFound({}, 'City not found');

    const exists = await Village.findOne({
      cityId: city._id,
      $or: [{ normalizedNameAr: data.nameAr.toLowerCase() }, { normalizedNameEn: data.nameEn.toLowerCase() }],
    });
    if (exists) {
      let validationErrorObject = {};
      if (exists.normalizedNameAr == data.nameAr.toLowerCase()) validationErrorObject.nameAr = ValidationTypes.AlreadyExists;
      if (exists.normalizedNameEn == data.nameEn.toLowerCase()) validationErrorObject.nameEn = ValidationTypes.AlreadyExists;
      throw ErrorHandler.badRequest(validationErrorObject);
    }
    const village = new Village(data);
    await village.save();
    return {
      _id: village._id,
      nameEn: village.nameEn,
      nameAr: village.nameAr,
      createdAt: village.createdAt,
      url: village.url || null,
    };
  }
  async update(data) {
    const village = await Village.findOne({ _id: data.villageId });
    if (!village) throw ErrorHandler.notFound();

    let orCondition = [];

    if (data?.nameAr) orCondition.push({ normalizedNameAr: data.nameAr.toLowerCase() });
    if (data?.nameEn) orCondition.push({ normalizedNameEn: data.nameEn.toLowerCase() });
    if (orCondition.length) {
      const checkNameExists = await Village.findOne({ cityId: village.cityId, _id: { $ne: village._id }, $or: orCondition });
      if (checkNameExists) {
        let validationErrorObject = {};
        if (checkNameExists.normalizedNameAr == data.nameAr.toLowerCase())
          validationErrorObject.nameAr = ValidationTypes.AlreadyExists;
        if (checkNameExists.normalizedNameEn == data.nameEn.toLowerCase())
          validationErrorObject.nameEn = ValidationTypes.AlreadyExists;
        throw ErrorHandler.badRequest(validationErrorObject);
      }
    }

    const updated = await Village.findOneAndUpdate({ _id: village._id }, data);
    if (!updated)
      throw ErrorHandler.internalServerError({}, 'An error occurred while updating the resource. Please try again later.');
    return 'Village updated successfully';
  }
  async getAll(cityId) {
    return await Village.find({ cityId }).sort('-createdAt').select('nameAr nameEn url createdAt updatedAt');
  }
  async getDetails(_id) {
    const village = await Village.findOne({ _id }).select('nameAr nameEn url cityId createdAt updatedAt');
    if (!village) throw ErrorHandler.notFound({}, 'Village not found');
    return village;
  }
  async getList() {
    return await Village.aggregate([
      { $lookup: { from: 'cities', localField: 'cityId', foreignField: '_id', as: 'city' } },
      { $unwind: '$city' },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 1,
          nameEn: 1,
          nameAr: 1,
          url: 1,
          city: {
            _id: '$city._id',
            nameEn: '$city.nameEn',
            nameAr: '$city.nameAr',
          },
        },
      },
    ]);
  }
  async getMyVillages(_id) {
    const list = [];
    const ContractService = require('../../contract/services/Contract.Service');
    const contract = await ContractService.getDetails(_id);
    if (!contract)
      throw ErrorHandler.badRequest({}, 'A contract is required. Please ensure that you have associated contract.');
    list.push({ village: contract.village, city: contract.city });
    const villages = await Village.find({ _id: { $ne: contract.village._id } }).populate('cityId');
    villages.map((village) =>
      list.push({
        village: { _id: village._id, nameEn: village.nameEn, nameAr: village.nameAr, url: village.url || null },
        city: { _id: village.cityId._id, nameEn: village.cityId.nameEn, nameAr: village.cityId.nameAr },
      }),
    );
    return list;
  }
}
module.exports = new VillageService();
