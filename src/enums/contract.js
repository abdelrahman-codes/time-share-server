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
  AddManual: 'Add Manual',
};

const PackageTypeEnum = {
  Platinum: 'Platinum',
  Diamond: 'Diamond',
  Golden: 'Golden',
};
const ClientFromEnum = {
  Gargada: 'الغردقة',
  Saudi: 'السعودية',
  mohandeseen: 'المهندسين',
  AhlMasr: 'مركب ممشي اهل مصر',
  ArdElGolf: 'ارض الجولف',
  Roxy: 'روكسي',
};

module.exports = {
  ContractPaymentMethodEnum,
  ContractMembershipTypeEnum,
  installmentsTypeEnum,
  ContractPaidStatusEnum,
  PackageTypeEnum,
  ClientFromEnum,
};
