const Joi = require('joi');
const { email, password, isValidObjectId } = require('../../Common/validations/custom');
const Roles = require('../../../../enums/roles');
const createUserDto = {
  body: Joi.object().keys({
    url: Joi.string().optional(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    mobile: Joi.string().required(),
    email: Joi.string().custom(email).optional(),
    rule: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().custom(password).required(),
    role: Joi.string().required().valid(Roles.Owner, Roles.Admin, Roles.Member, Roles.SuperVisor),
  }),
};
const updateUserDto = {
  params: Joi.object().keys({
    _id: Joi.string().custom(isValidObjectId).required(),
  }),
  body: Joi.object()
    .keys({
      url: Joi.string().optional(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      mobile: Joi.string().optional(),
      email: Joi.string().custom(email).optional(),
      rule: Joi.string().optional(),
      password: Joi.string().custom(password).optional(),
      role: Joi.string().optional().valid(Roles.Owner, Roles.Admin, Roles.Member, Roles.SuperVisor),
    })
    .or('firstName', 'lastName', 'mobile', 'email', 'rule', 'password', 'role', 'url')
    .messages({ 'object.missing': 'At least one update field must be provided' }),
};
const updateMyProfileDto = {
  body: Joi.object()
    .keys({
      url: Joi.string().optional(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      mobile: Joi.string().optional(),
      email: Joi.string().custom(email).optional(),
      rule: Joi.string().optional(),
      password: Joi.string().custom(password).optional(),
    })
    .or('firstName', 'lastName', 'mobile', 'email', 'rule', 'password', 'url')
    .messages({ 'object.missing': 'At least one update field must be provided' }),
};

module.exports = {
  createUserDto,
  updateUserDto,
  updateMyProfileDto,
};
