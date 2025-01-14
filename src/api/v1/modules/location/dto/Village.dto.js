const Joi = require('joi');
const { isValidObjectId } = require('../../../Common/validations/custom');
const create = {
  body: Joi.object().keys({
    cityId: Joi.string().custom(isValidObjectId).required(),
    nameAr: Joi.string().required(),
    nameEn: Joi.string().required(),
  }),
};
const update = {
  params: Joi.object().keys({
    _id: Joi.string().custom(isValidObjectId).required(),
  }),
  body: Joi.object()
    .keys({
      nameAr: Joi.string().optional(),
      nameEn: Joi.string().optional(),
    })
    .or('nameAr', 'nameEn')
    .messages({ 'object.missing': 'At least one update field must be provided' }),
};
module.exports = {
  create,
  update,
};
