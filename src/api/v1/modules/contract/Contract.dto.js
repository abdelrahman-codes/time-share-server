const Joi = require('joi');
const { isValidObjectId, date } = require('../../Common/validations/custom');
const { ContractPaymentMethodEnum, ContractMembershipTypeEnum } = require('../../../../enums/contract');
const create = {
  body: Joi.object().keys({
    leadId: Joi.string().custom(isValidObjectId).required(),
    
    paymentMethod: Joi.string().valid(ContractPaymentMethodEnum.Cash, ContractPaymentMethodEnum.Installments).required(),
    totalAmount: Joi.number().min(1).required(),

    downPayment: Joi.alternatives().conditional('paymentMethod', {
      is: ContractPaymentMethodEnum.Cash,
      then: Joi.forbidden(),
      otherwise: Joi.number().min(1).required(),
    }),
    numberOfInstallments: Joi.alternatives().conditional('paymentMethod', {
      is: ContractPaymentMethodEnum.Cash,
      then: Joi.forbidden(),
      otherwise: Joi.number().min(1).required(),
    }),

    installmentStartIn: Joi.alternatives().conditional('paymentMethod', {
      is: ContractPaymentMethodEnum.Cash,
      then: Joi.forbidden(),
      otherwise: Joi.string().custom(date).required(),
    }),
    cityId: Joi.string().custom(isValidObjectId).required(),
    villageId: Joi.string().custom(isValidObjectId).required(),
    membershipType: Joi.string()
      .valid(ContractMembershipTypeEnum.Dragon150, ContractMembershipTypeEnum.Dragon250)
      .required(),
    individuals: Joi.number().valid(2, 4, 6, 8).required(),
    unitType: Joi.string().valid('A', 'B', 'C').required(),
  }),
};
module.exports = {
  create,
};
