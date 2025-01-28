const router = require('express').Router();
const { ValidationMiddleware, AuthMiddleware } = require('../../../../middlewares');
const ContractController = require('./Contract.Controller');
const ContractDto = require('./Contract.dto');
const Roles = require('../../../../enums/roles');

router.post('/', AuthMiddleware([Roles.Owner, Roles.Admin, Roles.Member, Roles.SuperVisor]), ValidationMiddleware(ContractDto.create), ContractController.create);

module.exports = router;
