const Joi = require('joi');
const { isValidObjectId, date } = require('../../Common/validations/custom');

const { TicketIssueTypeEnum } = require('../../../../enums/ticket');
const createTicketDto = {
  body: Joi.object().keys({
    leadId: Joi.string().custom(isValidObjectId).required(),
    content: Joi.string().required(),
    type: Joi.string()
      .required()
      .valid(
        TicketIssueTypeEnum.Contact,
        TicketIssueTypeEnum.Exchange,
        TicketIssueTypeEnum.Finance,
        TicketIssueTypeEnum.Membership,
        TicketIssueTypeEnum.MobileAppAccount,
        TicketIssueTypeEnum.Rent,
        TicketIssueTypeEnum.Reservation,
        TicketIssueTypeEnum.Other,
      ),
  }),
};
const createNoteDto = {
  body: Joi.object().keys({
    ticketId: Joi.string().custom(isValidObjectId).required(),
    content: Joi.string().required(),
  }),
};
const assignDto = {
  body: Joi.object().keys({
    ticketId: Joi.string().custom(isValidObjectId).required(),
    userId: Joi.string().custom(isValidObjectId).required(),
  }),
};

const createReservationTicketDto = {
  body: Joi.object().keys({
    villageId: Joi.string().custom(isValidObjectId).required(),
    totalDays: Joi.number().required().min(5).max(10),
    date: Joi.string().required().custom(date),
  }),
};
module.exports = {
  createTicketDto,
  createNoteDto,
  assignDto,
  createReservationTicketDto,
};
