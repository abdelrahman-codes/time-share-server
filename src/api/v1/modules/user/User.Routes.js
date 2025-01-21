const router = require('express').Router();
const Roles = require('../../../../enums/roles');
const { ValidationMiddleware, AuthMiddleware, MulterS3Middleware } = require('../../../../middlewares');
const UserController = require('./User.Controller');
const UserDto = require('./User.dto');
const CommonDto = require('../../Common/validations/Validation');

router.post(
  '/',
  AuthMiddleware(Roles.Owner),
  MulterS3Middleware('single', 'image', 'url'),
  ValidationMiddleware(UserDto.createUserDto),
  UserController.createUser,
);
router.put(
  '/',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.Member]),
  MulterS3Middleware('single', 'image', 'url'),
  ValidationMiddleware(UserDto.updateMyProfileDto),
  UserController.updateUser,
);
router.put(
  '/:_id',
  AuthMiddleware(Roles.Owner),
  MulterS3Middleware('single', 'image', 'url'),
  ValidationMiddleware(UserDto.updateUserDto),
  UserController.updateUser,
);
router.get('/', AuthMiddleware(Roles.Owner), UserController.get);
router.get('/details', AuthMiddleware([Roles.Owner, Roles.Admin, Roles.Member]), UserController.getDetails);
router.get('/details/:_id', AuthMiddleware(Roles.Owner), ValidationMiddleware(CommonDto._idDto), UserController.getDetails);
router.patch(
  '/toggle-hold/:_id',
  AuthMiddleware(Roles.Owner),
  ValidationMiddleware(CommonDto._idDto),
  UserController.toggleActiveStatus,
);

module.exports = router;
