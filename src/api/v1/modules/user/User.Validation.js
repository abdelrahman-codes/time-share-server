const Joi = require('joi');
const { email, password } = require('../../Common/validations/custom');
const createUserDto = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().custom(email).required(),
    password: Joi.string().custom(password).required(),
  }),
};

module.exports = {
  createUserDto,
};
