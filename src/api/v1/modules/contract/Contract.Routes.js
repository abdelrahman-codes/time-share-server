const router = require('express').Router();
const { ValidationMiddleware, AuthMiddleware } = require('../../../../middlewares');
const ContractController = require('./Contract.Controller');
const ContractDto = require('./Contract.dto');
const CommonDto = require('../../Common/validations/Validation');
const Roles = require('../../../../enums/roles');

router.post('/', AuthMiddleware(Roles.Owner), ValidationMiddleware(ContractDto.create), ContractController.create);


module.exports = router;
