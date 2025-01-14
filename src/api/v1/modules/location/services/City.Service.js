const ErrorHandler = require('../../../../../enums/errors');
const { ValidationTypes } = require('../../../../../enums/error-types');
const { City } = require('../entities');
class CityService {
  async create(data) {
    const exists = await City.findOne({
      $or: [{ normalizedNameAr: data.nameAr.toLowerCase() }, { normalizedNameEn: data.nameEn.toLowerCase() }],
    });
    if (exists) {
      let validationErrorObject = {};
      if (exists.normalizedNameAr == data.nameAr.toLowerCase()) validationErrorObject.nameAr = ValidationTypes.AlreadyExists;
      if (exists.normalizedNameEn == data.nameEn.toLowerCase()) validationErrorObject.nameEn = ValidationTypes.AlreadyExists;
      throw ErrorHandler.badRequest(validationErrorObject);
    }
    const city = new City(data);
    await city.save();
    return { _id: city._id, nameEn: city.nameEn, nameAr: city.nameAr, createdAt: city.createdAt };
  }
  async update(data) {
    const city = await City.findOne({ _id: data.cityId });
    if (!city) throw ErrorHandler.notFound();

    let orCondition = [];

    if (data?.nameAr) orCondition.push({ normalizedNameAr: data.nameAr.toLowerCase() });
    if (data?.nameEn) orCondition.push({ normalizedNameEn: data.nameEn.toLowerCase() });

    const checkNameExists = await City.findOne({ _id: { $ne: city._id }, $or: orCondition });
    if (checkNameExists) {
      let validationErrorObject = {};
      if (checkNameExists.normalizedNameAr == data.nameAr.toLowerCase())
        validationErrorObject.nameAr = ValidationTypes.AlreadyExists;
      if (checkNameExists.normalizedNameEn == data.nameEn.toLowerCase())
        validationErrorObject.nameEn = ValidationTypes.AlreadyExists;
      throw ErrorHandler.badRequest(validationErrorObject);
    }

    const updated = await City.findOneAndUpdate({ _id: city._id }, data);
    if (!updated)
      throw ErrorHandler.internalServerError({}, 'An error occurred while updating the resource. Please try again later.');
    return 'City updated successfully';
  }
  async getDetails(cityId) {
    const city = await City.findOne({ _id: cityId });
    if (!city) throw ErrorHandler.notFound({}, 'City not found');
    const { normalizedNameAr, normalizedNameEn, ...result } = city.toObject();
    return result;
  }
  async getAll() {
    return await City.find().sort('-createdAt').select('nameAr nameEn createdAt updatedAt');
  }
}
module.exports = new CityService();
