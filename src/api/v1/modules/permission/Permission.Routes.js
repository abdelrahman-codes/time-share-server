const router = require('express').Router();
const { ValidationMiddleware } = require('../../../../middlewares');
const PermissionController = require('./Permission.Controller');
const CommonDto = require('../../Common/validations/Validation');

router.get('/all/:_id', ValidationMiddleware(CommonDto._idDto), PermissionController.getAll);

module.exports = router;
