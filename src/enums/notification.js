const notificationMediumEnum = {
  Both: 'Both',
  Web: 'Web',
  Mobile: 'Mobile',
};
const notificationTypeEnum = {
  ReservationRequest: 'Reservation Request',
  ContactRequest: 'Contact Request',
  Payment: 'Payment',
  AssignedTicket: 'Assigned Ticket',
  InstallmentReminder: 'Reminder',
  PaymentConfirmation: 'Payment Confirmation',
};
module.exports = { notificationMediumEnum, notificationTypeEnum };
