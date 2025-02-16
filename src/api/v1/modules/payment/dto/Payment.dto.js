const Joi = require('joi');
const { isValidObjectId } = require('../../../Common/validations/custom');

const create = {
  body: Joi.object().keys({
    leadId: Joi.string().custom(isValidObjectId).required(),
    transactionNumber: Joi.string().required(),
    amount: Joi.number().min(1).required(),
    url: Joi.string().required(),
  }),
};
module.exports = {
  create,
};
