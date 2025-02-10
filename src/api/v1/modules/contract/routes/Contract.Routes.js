const router = require('express').Router();
const { ValidationMiddleware, AuthMiddleware } = require('../../../../../middlewares');
const ContractController = require('../controllers/Contract.Controller');
const ContractDto = require('../dto/Contract.dto');
const Roles = require('../../../../../enums/roles');

router.post(
  '/',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.Member, Roles.SuperVisor]),
  ValidationMiddleware(ContractDto.create),
  ContractController.create,
);
router.get('/', AuthMiddleware(Roles.Lead), ContractController.getDetails);

module.exports = router;
