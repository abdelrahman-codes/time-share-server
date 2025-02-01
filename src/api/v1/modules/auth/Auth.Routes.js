const router = require('express').Router();
const { ValidationMiddleware } = require('../../../../middlewares');
const AuthController = require('./Auth.Controller');
const AuthDto = require('./Auth.dto');

router.post('/login', ValidationMiddleware(AuthDto.loginUserDto), AuthController.dashboardLogin);
router.post('/mobile/login', ValidationMiddleware(AuthDto.loginUserDto), AuthController.mobileLogin);

module.exports = router;
