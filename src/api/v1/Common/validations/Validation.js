// Common DTOs
const Joi = require('joi');
const { isValidObjectId } = require('./custom');

const _idDto = {
  params: Joi.object().keys({
    _id: Joi.string().custom(isValidObjectId).required(),
  }),
};

module.exports = {
  _idDto,
};
