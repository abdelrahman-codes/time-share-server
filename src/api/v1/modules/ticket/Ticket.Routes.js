const router = require('express').Router();
const Roles = require('../../../../enums/roles');
const { ValidationMiddleware, AuthMiddleware } = require('../../../../middlewares');
const TicketController = require('./Ticket.Controller');
const TicketDto = require('./Ticket.dto');
const CommonDto = require('../../Common/validations/Validation');

router.post(
  '/',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  ValidationMiddleware(TicketDto.createTicketDto),
  TicketController.create,
);
router.post(
  '/note',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  ValidationMiddleware(TicketDto.createNoteDto),
  TicketController.createNote,
);
router.patch(
  '/:_id',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  ValidationMiddleware(CommonDto._idDto),
  TicketController.resolveTicket,
);
router.get(
  '/:_id',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  ValidationMiddleware(CommonDto._idDto),
  TicketController.getAll,
);
router.post(
  '/assign',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  ValidationMiddleware(TicketDto.assignDto),
  TicketController.assign,
);
module.exports = router;
