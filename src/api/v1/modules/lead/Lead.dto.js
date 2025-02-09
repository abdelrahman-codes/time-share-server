const Joi = require('joi');
const { email, isValidObjectId, password } = require('../../Common/validations/custom');
const {
  NationalityEnum,
  ContactMethodEnum,
  GetFromEnum,
  UserCategoryEnum,
  MobileAppRequestEnum,
} = require('../../../../enums/lead');
const createDto = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    mobile: Joi.string().required(),
    whatsappMobileNumber: Joi.string().optional(),
    nationalId: Joi.string().optional(),
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
    url: Joi.string().optional(),
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
      nationalId: Joi.string().optional(),
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
      url: Joi.string().optional(),
    })
    .or(
      'name',
      'firstName',
      'lastName',
      'mobile',
      'nationalId',
      'whatsappMobileNumber',
      'email',
      'nationality',
      'address',
      'contactMethod',
      'getFrom',
      'category',
      'url',
    )
    .messages({ 'object.missing': 'At least one update field must be provided' }),
};

const updateMyDateDto = {
  body: Joi.object()
    .keys({
      name: Joi.string().optional(),
      mobile: Joi.string().optional(),
      email: Joi.string().custom(email).optional(),
      url: Joi.string().optional(),
      password: Joi.string().optional().custom(password),
      cPassword: Joi.alternatives().conditional('password', {
        is: Joi.exist(),
        then: Joi.string().valid(Joi.ref('password')).required().messages({
          'any.only': 'The passwords you entered do not match. Please ensure both fields contain the same password.',
          'any.required': 'Please confirm your password.',
        }),
        otherwise: Joi.forbidden(),
      }),
    })
    .or('name', 'mobile', 'email', 'url', 'password')
    .messages({ 'object.missing': 'At least one update field must be provided' }),
};

const get = {
  query: Joi.object().keys({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    searchTerm: Joi.string().optional().allow(''),
    contactMethod: Joi.alternatives().try(
      Joi.string()
        .valid(ContactMethodEnum.Facebook, ContactMethodEnum.Google, ContactMethodEnum.Manual, ContactMethodEnum.Website)
        .optional()
        .allow(''),
      Joi.array()
        .items(
          Joi.string().valid(
            ContactMethodEnum.Facebook,
            ContactMethodEnum.Google,
            ContactMethodEnum.Manual,
            ContactMethodEnum.Website,
          ),
        )
        .optional(),
    ),

    getFrom: Joi.alternatives().try(
      Joi.string().optional().valid(GetFromEnum.Call, GetFromEnum.Form, GetFromEnum.Manual, GetFromEnum.Whatsapp).allow(''),
      Joi.array()
        .items(Joi.string().valid(GetFromEnum.Call, GetFromEnum.Form, GetFromEnum.Manual, GetFromEnum.Whatsapp))
        .optional(),
    ),
    category: Joi.alternatives().try(
      Joi.string()
        .valid(UserCategoryEnum.PremiumLead, UserCategoryEnum.Rubbish, UserCategoryEnum.UnKnown)
        .optional()
        .allow(''),
      Joi.array()
        .items(Joi.string().valid(UserCategoryEnum.PremiumLead, UserCategoryEnum.Rubbish, UserCategoryEnum.UnKnown))
        .optional(),
    ),
    mobileAppRequest: Joi.alternatives().try(
      Joi.string().valid(MobileAppRequestEnum.HaveAccount, MobileAppRequestEnum.NoAccount).optional(),
      Joi.array().items(Joi.string().valid(MobileAppRequestEnum.HaveAccount, MobileAppRequestEnum.NoAccount)).optional(),
    ),
  }),
};

module.exports = {
  createDto,
  updateDto,
  get,
  updateMyDateDto,
};
