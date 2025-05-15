const Joi = require('joi');
const { isValidObjectId, date, email } = require('../../../Common/validations/custom');
const {
  ContractPaymentMethodEnum,
  ContractMembershipTypeEnum,
  installmentsTypeEnum,
  PackageTypeEnum,
  ClientFromEnum,
  ContractCountriesEnum
} = require('../../../../../enums/contract');
const create = {
  body: Joi.object().keys({
    leadId: Joi.string().custom(isValidObjectId).required(),
    country:Joi.string().valid(ContractCountriesEnum.Egypt,ContractCountriesEnum.Saudi).optional(),
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
        .valid(
          installmentsTypeEnum.Monthly,
          installmentsTypeEnum.ThreeMonth,
          installmentsTypeEnum.SixMonth,
          installmentsTypeEnum.AddManual,
        )
        .required(),
    }),

    startUsageWhenComplete: Joi.alternatives().conditional('paymentMethod', {
      is: ContractPaymentMethodEnum.Cash,
      then: Joi.forbidden(),
      otherwise: Joi.number().min(1).max(100).required(),
    }),

    numberOfInstallments: Joi.alternatives().conditional('paymentMethod', {
      is: ContractPaymentMethodEnum.Cash,
      then: Joi.forbidden(),
      otherwise: Joi.alternatives().conditional('installmentsType', {
        is: Joi.valid(installmentsTypeEnum.Monthly, installmentsTypeEnum.ThreeMonth, installmentsTypeEnum.SixMonth),
        then: Joi.number().min(1).required(),
        otherwise: Joi.forbidden(),
      }),
    }),

    contractInstallmentsList: Joi.alternatives().conditional('paymentMethod', {
      is: ContractPaymentMethodEnum.Cash,
      then: Joi.forbidden(),
      otherwise: Joi.alternatives().conditional('installmentsType', {
        is: installmentsTypeEnum.AddManual,
        then: Joi.array()
          .items(
            Joi.object().keys({
              installmentAmount: Joi.number().min(1).required(),
              installmentDate: Joi.string().custom(date).required(),
            }),
          )
          .min(1)
          .required()
          .unique()
          .messages({
            'array.min': 'There should be at least one installment',
          }),
        otherwise: Joi.forbidden(),
      }),
    }),

    installmentStartIn: Joi.alternatives().conditional('paymentMethod', {
      is: ContractPaymentMethodEnum.Cash,
      then: Joi.forbidden(),
      otherwise: Joi.alternatives().conditional('installmentsType', {
        is: Joi.valid(installmentsTypeEnum.Monthly, installmentsTypeEnum.ThreeMonth, installmentsTypeEnum.SixMonth),
        then: Joi.string().custom(date).required(),
        otherwise: Joi.forbidden(),
      }),
    }),

    villageId: Joi.string().custom(isValidObjectId).required(),
    membershipType: Joi.string()
      .valid(ContractMembershipTypeEnum.Dragon100, ContractMembershipTypeEnum.Dragon200)
      .required(),
    individuals: Joi.number().valid(2, 4, 6, 8).required(),
    unitType: Joi.string().valid('A', 'B', 'C').required(),
    contractDate: Joi.string().custom(date).required(),
    clientFrom: Joi.string().required(),
    contractNumber: Joi.string().required(),
  }),
};

const createCustomPackage = {
  body: Joi.object().keys({
    packageType: Joi.string().required().valid(PackageTypeEnum.Platinum, PackageTypeEnum.Golden, PackageTypeEnum.Diamond),
    paymentMethod: Joi.string().valid(ContractPaymentMethodEnum.Cash, ContractPaymentMethodEnum.Installments).required(),
    name: Joi.string().required(),
    mobile: Joi.string().required(),
    email: Joi.string().optional().custom(email),
    nationality: Joi.string().optional(),
    nationalId: Joi.number().optional(),
  }),
};
module.exports = {
  create,
  createCustomPackage,
};
