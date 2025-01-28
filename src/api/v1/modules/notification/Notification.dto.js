const Joi = require('joi');
const { AccessLevelEnum } = require('../../../../enums/permission');
const { isValidObjectId } = require('../../Common/validations/custom');
const updateAccessLevelDto = {
  params: Joi.object().keys({
    _id: Joi.string().custom(isValidObjectId).required(),
  }),
  body: Joi.object().keys({
    feature: Joi.string().required(),
    accessLevel: Joi.string().required().valid(AccessLevelEnum.Edit, AccessLevelEnum.View, AccessLevelEnum.Hidden),
  }),
};
module.exports = {
  updateAccessLevelDto,
};
