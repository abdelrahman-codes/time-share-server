const Joi = require('joi');
const { isValidObjectId, date } = require('../../Common/validations/custom');
const createDto = {
  body: Joi.object().keys({
    leadId: Joi.string().custom(isValidObjectId).required(),
    villageId: Joi.string().custom(isValidObjectId).required(),
    usage: Joi.number().required(),
    reservationDate: Joi.string().custom(date).required(),
  }),
};
module.exports = {
  createDto,
};
