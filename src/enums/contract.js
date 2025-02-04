const ContractPaymentMethodEnum = {
  Cash: 'Cash',
  Installments: 'Installments',
};
const ContractPaidStatusEnum = {
  Pending: 'Pending',
  Done: 'Done',
};
const ContractMembershipTypeEnum = {
  Dragon100: 'Dragon 100 Nights',
  Dragon200: 'Dragon 200 Nights',
};
const installmentsTypeEnum = {
  Monthly: 'Monthly',
  ThreeMonth: '3 Months',
  SixMonth: '6 Months',
};
module.exports = { ContractPaymentMethodEnum, ContractMembershipTypeEnum, installmentsTypeEnum, ContractPaidStatusEnum };
