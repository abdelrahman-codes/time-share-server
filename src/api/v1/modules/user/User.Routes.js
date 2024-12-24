const router = require('express').Router();
const { ValidationMiddleware } = require('../../../../middlewares');
const UserController = require('./User.Controller');
const UserValidation = require('./User.Validation');

router.post('/', ValidationMiddleware(UserValidation.createUserDto), UserController.createUser);
router.get('/', UserController.get);

module.exports = router;
