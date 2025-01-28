const router = require('express').Router();
const { ValidationMiddleware, AuthMiddleware } = require('../../../../middlewares');
const NotificationController = require('./Notification.Controller');
const NotificationDto = require('./Notification.dto');
const Roles = require('../../../../enums/roles');

router.get(
  '/dashboard',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  NotificationController.getAll,
);

module.exports = router;
