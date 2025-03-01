const router = require('express').Router();
const { ValidationMiddleware, AuthMiddleware } = require('../../../../middlewares');
const ReservationController = require('./Reservation.Controller');
const ReservationDto = require('./Reservation.dto');
const CommonDto = require('../../Common/validations/Validation');
const Roles = require('../../../../enums/roles');

router.get(
  '/:_id',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  ValidationMiddleware(CommonDto._idDto),
  ReservationController.getAll,
);
router.get('/', AuthMiddleware([Roles.Lead]), ReservationController.getAll);
router.post(
  '/',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  ValidationMiddleware(ReservationDto.createDto),
  ReservationController.create,
);
router.patch(
  '/cancel/:_id',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  ValidationMiddleware(CommonDto._idDto),
  ReservationController.cancel,
);

module.exports = router;
