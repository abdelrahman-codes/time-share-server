const Joi = require('joi');
const { isValidObjectId } = require('../../Common/validations/custom');

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
module.exports = {
  createTicketDto,
  createNoteDto,
};
