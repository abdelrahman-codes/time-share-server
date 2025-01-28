const router = require('express').Router();
const { ValidationMiddleware, AuthMiddleware } = require('../../../../middlewares');
const NotificationController = require('./Notification.Controller');
const CommonDto = require('../../Common/validations/Validation');
const Roles = require('../../../../enums/roles');

router.get(
  '/dashboard',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  NotificationController.getAll,
);
router.patch(
  '/mark-as-read/:_id',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member, Roles.Lead]),
  ValidationMiddleware(CommonDto._idDto),
  NotificationController.markAsRead,
);

module.exports = router;
