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

module.exports = router;
