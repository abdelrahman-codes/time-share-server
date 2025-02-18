const router = require('express').Router();
const { ValidationMiddleware, AuthMiddleware, MulterS3Middleware } = require('../../../../../middlewares');
const PaymentController = require('../controllers/Payment.Controller');
const PaymentDto = require('../dto/Payment.dto');
const CommonDto = require('../../../Common/validations/Validation');
const Roles = require('../../../../../enums/roles');
CommonDto;
router.post(
  '/',
  MulterS3Middleware('single', 'image', 'url'),
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.Member, Roles.SuperVisor]),
  ValidationMiddleware(PaymentDto.create),
  PaymentController.create,
);

router.get(
  '/logs/:_id',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.Member, Roles.SuperVisor]),
  ValidationMiddleware(CommonDto._idDto),
  PaymentController.getAll,
);
router.get('/logs', AuthMiddleware([Roles.Lead]), PaymentController.getAll);

module.exports = router;
