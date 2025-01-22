const ModuleEnum = {
  Lead: 'leadModule',
};

const AccessLevelEnum = {
  Hidden: 'Hidden',
  View: 'View',
  Edit: 'Edit',
};
const LeadFeatureEnum = {
  CreateLead: 'createLead',
  EditLead: 'editLead',
  ListLead: 'listLead',
  OpenTicket: 'openTicket',
  ResolveTicket: 'resolveTicket',
  AddNote: 'addNote',
  ReserveNights: 'reserveNights',
  ListReservations: 'listReservations',
  AddPayment: 'addPayment',
  EditPayment: 'editPayment',
  ListPayments: 'listPayments',
  EditUsage: 'editUsage',
  GenerateAccount: 'generateAccount',
  ResetPassword: 'resetPassword',
  AddContract: 'addContract',
};
const LeadFeatureDefaultAccessLevelEnum = {
  createLead: AccessLevelEnum.Edit,
  editLead: AccessLevelEnum.Edit,
  listLead: AccessLevelEnum.Edit,
  openTicket: AccessLevelEnum.Edit,
  resolveTicket: AccessLevelEnum.Edit,
  addNote: AccessLevelEnum.Edit,
  reserveNights: AccessLevelEnum.Edit,
  listReservations: AccessLevelEnum.Edit,
  addPayment: AccessLevelEnum.View,
  editPayment: AccessLevelEnum.View,
  listPayments: AccessLevelEnum.View,
  editUsage: AccessLevelEnum.Edit,
  generateAccount: AccessLevelEnum.Edit,
  resetPassword: AccessLevelEnum.Edit,
  addContract: AccessLevelEnum.View,
};
module.exports = {
  LeadFeatureEnum,
  AccessLevelEnum,
  ModuleEnum,
  LeadFeatureDefaultAccessLevelEnum,
};
