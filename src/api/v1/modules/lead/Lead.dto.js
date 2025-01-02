const Joi = require('joi');
const { email, isValidObjectId } = require('../../Common/validations/custom');
const { NationalityEnum, ContactMethodEnum, GetFromEnum, UserCategoryEnum } = require('../../../../enums/lead');
const createDto = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    mobile: Joi.string().required(),
    whatsappMobileNumber: Joi.string().optional(),
    email: Joi.string().custom(email).optional(),
    nationality: Joi.string().optional().valid(NationalityEnum.Egyptian, NationalityEnum.Foreign),
    address: Joi.string().optional(),
    contactMethod: Joi.string()
      .valid(ContactMethodEnum.Facebook, ContactMethodEnum.Google, ContactMethodEnum.Manual, ContactMethodEnum.Website)
      .optional(),
    getFrom: Joi.string().optional().valid(GetFromEnum.Call, GetFromEnum.Form, GetFromEnum.Manual, GetFromEnum.Whatsapp),
    category: Joi.string()
      .valid(UserCategoryEnum.PremiumLead, UserCategoryEnum.Rubbish, UserCategoryEnum.UnKnown)
      .optional(),
    pic: Joi.string().optional(),
  }),
};
const updateDto = {
  params: Joi.object().keys({
    _id: Joi.string().custom(isValidObjectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().optional(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      mobile: Joi.string().optional(),
      whatsappMobileNumber: Joi.string().optional(),
      email: Joi.string().custom(email).optional(),
      nationality: Joi.string().optional().valid(NationalityEnum.Egyptian, NationalityEnum.Foreign),
      address: Joi.string().optional(),
      contactMethod: Joi.string()
        .valid(ContactMethodEnum.Facebook, ContactMethodEnum.Google, ContactMethodEnum.Manual, ContactMethodEnum.Website)
        .optional(),
      getFrom: Joi.string().optional().valid(GetFromEnum.Call, GetFromEnum.Form, GetFromEnum.Manual, GetFromEnum.Whatsapp),
      category: Joi.string()
        .valid(UserCategoryEnum.PremiumLead, UserCategoryEnum.Rubbish, UserCategoryEnum.UnKnown)
        .optional(),
      pic: Joi.string().optional(),
    })
    .or(
      'name',
      'firstName',
      'lastName',
      'mobile',
      'whatsappMobileNumber',
      'email',
      'nationality',
      'address',
      'contactMethod',
      'getFrom',
      'category',
      'pic',
    )
    .messages({ 'object.missing': 'At least one update field must be provided' }),
};

module.exports = {
  createDto,
  updateDto,
};
