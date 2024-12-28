const Joi = require('joi');
const loginUserDto = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
module.exports = {
  loginUserDto,
};
