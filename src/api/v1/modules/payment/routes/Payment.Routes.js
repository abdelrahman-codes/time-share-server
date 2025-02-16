const router = require('express').Router();
const { ValidationMiddleware, AuthMiddleware,MulterS3Middleware } = require('../../../../../middlewares');
const PaymentController = require('../controllers/Payment.Controller');
const PaymentDto = require('../dto/Payment.dto');
const Roles = require('../../../../../enums/roles');

router.post(
  '/',
  MulterS3Middleware('single', 'image', 'url'),
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.Member, Roles.SuperVisor]),
  ValidationMiddleware(PaymentDto.create),
  PaymentController.create,
);

module.exports = router;
