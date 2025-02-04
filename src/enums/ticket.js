const TicketContentTypeEnum = {
  Create: 'Created by',
  Note: 'Noted by',
  Mention: 'Mentioned by',
  Resolve: 'Resolved by',
};
const TicketStatusEnum = {
  Resolved: 'Resolved',
  InProgress: 'In Progress',
};

const TicketIssueTypeEnum = {
  Membership: 'Membership',
  Exchange: 'Exchange',
  Reservation: 'Reservation',
  MobileAppAccount: 'MobileAppAccount',
  Finance: 'Finance',
  Rent: 'Rent',
  Contact: 'Contact',
  Other: 'Other',
};

module.exports = {
  TicketContentTypeEnum,
  TicketStatusEnum,
  TicketIssueTypeEnum,
};
