const router = require('express').Router();
const { ValidationMiddleware } = require('../../../../middlewares');
const AuthController = require('./Auth.Controller');
const AuthDto = require('./Auth.dto');

router.post('/login', ValidationMiddleware(AuthDto.loginUserDto), AuthController.dashboardLogin);

module.exports = router;
