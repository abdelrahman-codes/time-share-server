const ContactMethodEnum = {
  Website: 'WEBSITE',
  Google: 'GOOGLE',
  Facebook: 'FACEBOOK',
  Manual: 'MANUAL',
};

const GetFromEnum = {
  Whatsapp: 'WHATSAPP',
  Call: 'CALL',
  Form: 'FORM',
  Manual: 'MANUAL',
};

const UserCategoryEnum = {
  PremiumLead: 'PREMIUM_LEAD',
  Rubbish: 'RUBBISH',
  UnKnown: 'UNKNOWN',
};

const MobileAppRequestEnum = {
  HaveAccount: 'HAVE_ACCOUNT',
  NoAccount: 'NO_ACCOUNT',
};

const NationalityEnum = {
  Egyptian: 'Egyptian',
  Foreign: 'Foreign',
};

const TicketStatusEnum = {
  Done: 'Done',
  Pending: 'Pending',
};

module.exports = {
  ContactMethodEnum,
  GetFromEnum,
  UserCategoryEnum,
  MobileAppRequestEnum,
  NationalityEnum,
  TicketStatusEnum,
};
