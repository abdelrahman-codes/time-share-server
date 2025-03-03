const notificationMediumEnum = {
  Both: 'Both',
  Web: 'Web',
  Mobile: 'Mobile',
};
const notificationTypeEnum = {
  ReservationRequest: 'Reservation Request',
  Payment: 'Payment',
  AssignedTicket: 'Assigned Ticket',
  InstallmentReminder: 'Installment Reminder',
  PaymentConfirmation: 'Payment Confirmation',
};
module.exports = { notificationMediumEnum, notificationTypeEnum };
