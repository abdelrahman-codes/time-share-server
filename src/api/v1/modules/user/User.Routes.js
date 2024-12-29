const router = require('express').Router();
const Roles = require('../../../../enums/roles');
const { ValidationMiddleware, AuthMiddleware, MulterMiddleware } = require('../../../../middlewares');
const UserController = require('./User.Controller');
const UserDto = require('./User.dto');

router.post(
  '/',
  AuthMiddleware(Roles.Owner),
  MulterMiddleware('single', './public/media', 'image', 'pic'),
  ValidationMiddleware(UserDto.createUserDto),
  UserController.createUser,
);
router.put(
  '/',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.Member]),
  MulterMiddleware('single', './public/media', 'image', 'pic'),
  ValidationMiddleware(UserDto.updateMyProfileDto),
  UserController.updateUser,
);
router.put(
  '/:_id',
  AuthMiddleware(Roles.Owner),
  MulterMiddleware('single', './public/media', 'image', 'pic'),
  ValidationMiddleware(UserDto.updateUserDto),
  UserController.updateUser,
);
router.get('/', AuthMiddleware(Roles.Owner), UserController.get);
router.get('/details', AuthMiddleware([Roles.Owner, Roles.Admin, Roles.Member]), UserController.getDetails);
router.get('/details/:_id', AuthMiddleware(Roles.Owner), UserController.getDetails);

module.exports = router;
