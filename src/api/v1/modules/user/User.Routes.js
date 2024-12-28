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
  '/:_id',
  AuthMiddleware(Roles.Owner),
  MulterMiddleware('single', './public/media', 'image', 'pic'),
  ValidationMiddleware(UserDto.updateUserDto),
  UserController.updateUser,
);
router.get('/', AuthMiddleware(Roles.Owner), UserController.get);

module.exports = router;
