const router = require('express').Router();
const Roles = require('../../../../enums/roles');
const { ValidationMiddleware, AuthMiddleware, MulterS3Middleware } = require('../../../../middlewares');
const LeadController = require('./Lead.Controller');
const LeadDto = require('./Lead.dto');
const CommonDto = require('../../Common/validations/Validation');

router.post(
  '/',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  MulterS3Middleware('single', 'image', 'url'),
  ValidationMiddleware(LeadDto.createDto),
  LeadController.create,
);

router.put(
  '/:_id',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  MulterS3Middleware('single', 'image', 'url'),
  ValidationMiddleware(LeadDto.updateDto),
  LeadController.update,
);
router.put(
  '/profile/data',
  AuthMiddleware(Roles.Lead),
  MulterS3Middleware('single', 'image', 'url'),
  ValidationMiddleware(LeadDto.updateMyDateDto),
  LeadController.update,
);
router.get(
  '/',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  ValidationMiddleware(LeadDto.get),
  LeadController.get,
);
router.get(
  '/details/:_id',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  ValidationMiddleware(CommonDto._idDto),
  LeadController.getDetails,
);

router.post(
  '/username/:_id',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  ValidationMiddleware(CommonDto._idDto),
  LeadController.createUserName,
);

router.patch(
  '/password/:_id',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  ValidationMiddleware(CommonDto._idDto),
  LeadController.resetPassword,
);

router.get('/main-data', AuthMiddleware(Roles.Lead), LeadController.homePage);
router.get('/profile/data', AuthMiddleware(Roles.Lead), LeadController.getDetails);
router.delete('/', AuthMiddleware(Roles.Lead), LeadController.deleteAccount);
router.patch(
  '/tokens/fcm-token',
  AuthMiddleware([Roles.Lead]),
  ValidationMiddleware(LeadDto.updateFcmTokenDto),
  LeadController.updateFcmToken,
);
module.exports = router;
