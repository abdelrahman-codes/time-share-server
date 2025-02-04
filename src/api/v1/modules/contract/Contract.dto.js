const Joi = require('joi');
const { isValidObjectId, date } = require('../../Common/validations/custom');
const {
  ContractPaymentMethodEnum,
  ContractMembershipTypeEnum,
  installmentsTypeEnum,
} = require('../../../../enums/contract');
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
    installmentsType: Joi.alternatives().conditional('paymentMethod', {
      is: ContractPaymentMethodEnum.Cash,
      then: Joi.forbidden(),
      otherwise: Joi.string()
        .valid(installmentsTypeEnum.Monthly, installmentsTypeEnum.ThreeMonth, installmentsTypeEnum.SixMonth)
        .required(),
    }),
    numberOfInstallments: Joi.alternatives().conditional('paymentMethod', {
      is: ContractPaymentMethodEnum.Cash,
      then: Joi.forbidden(),
      otherwise: Joi.number().min(1).required(),
    }),
    startUsageWhenComplete: Joi.alternatives().conditional('paymentMethod', {
      is: ContractPaymentMethodEnum.Cash,
      then: Joi.forbidden(),
      otherwise: Joi.number().min(1).max(100).required(),
    }),
    installmentStartIn: Joi.alternatives().conditional('paymentMethod', {
      is: ContractPaymentMethodEnum.Cash,
      then: Joi.forbidden(),
      otherwise: Joi.string().custom(date).required(),
    }),
    villageId: Joi.string().custom(isValidObjectId).required(),
    membershipType: Joi.string()
      .valid(ContractMembershipTypeEnum.Dragon100, ContractMembershipTypeEnum.Dragon200)
      .required(),
    individuals: Joi.number().valid(2, 4, 6, 8).required(),
    unitType: Joi.string().valid('A', 'B', 'C').required(),
    contractDate: Joi.string().custom(date).required(),
  }),
};
module.exports = {
  create,
};
