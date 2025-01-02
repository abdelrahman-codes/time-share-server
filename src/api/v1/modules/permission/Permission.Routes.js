const router = require('express').Router();
const { ValidationMiddleware, AuthMiddleware } = require('../../../../middlewares');
const PermissionController = require('./Permission.Controller');
const PermissionDto = require('./Permission.dto');
const CommonDto = require('../../Common/validations/Validation');
const Roles = require('../../../../enums/roles');

router.get('/all/:_id', AuthMiddleware(Roles.Owner), ValidationMiddleware(CommonDto._idDto), PermissionController.getAll);
router.patch(
  '/access-level/:_id',
  AuthMiddleware(Roles.Owner),
  ValidationMiddleware(PermissionDto.updateAccessLevelDto),
  PermissionController.updateFeatureAccessLevel,
);

module.exports = router;
