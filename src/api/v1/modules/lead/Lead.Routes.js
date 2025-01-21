const router = require('express').Router();
const Roles = require('../../../../enums/roles');
const { ValidationMiddleware, AuthMiddleware, MulterMiddleware } = require('../../../../middlewares');
const LeadController = require('./Lead.Controller');
const LeadDto = require('./Lead.dto');
const CommonDto = require('../../Common/validations/Validation');

router.post(
  '/',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  MulterMiddleware('single', 'public', 'image', 'url'),
  ValidationMiddleware(LeadDto.createDto),
  LeadController.create,
);

router.put(
  '/:_id',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]),
  MulterMiddleware('single', 'public', 'image', 'url'),
  ValidationMiddleware(LeadDto.updateDto),
  LeadController.update,
);
router.get('/', AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]), ValidationMiddleware(LeadDto.get), LeadController.get);
router.get('/details/:_id', AuthMiddleware([Roles.Owner, Roles.Admin, Roles.SuperVisor, Roles.Member]), ValidationMiddleware(CommonDto._idDto), LeadController.getDetails);

module.exports = router;
