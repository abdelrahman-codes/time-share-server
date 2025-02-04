const ContractPaymentMethodEnum = {
  Cash: 'Cash',
  Installments: 'Installments',
};
const ContractPaidStatusEnum = {
  Pending: 'Pending',
  Done: 'Done',
};
const ContractMembershipTypeEnum = {
  Dragon100: 'Dragon 150 Nights',
  Dragon200: 'Dragon 250 Nights',
};
const installmentsTypeEnum = {
  Monthly: 'Monthly',
  ThreeMonth: '3 Months',
  SixMonth: '6 Months',
};
module.exports = { ContractPaymentMethodEnum, ContractMembershipTypeEnum, installmentsTypeEnum, ContractPaidStatusEnum };
