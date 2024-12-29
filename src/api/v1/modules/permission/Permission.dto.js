const Joi = require('joi');
const createDto = {
  body: Joi.object().keys({}),
};
module.exports = {
  createDto,
};
