const router = require('express').Router();
const { ValidationMiddleware, AuthMiddleware } = require('../../../../../middlewares');
const { VillageController } = require('../controllers');
const { VillageDto } = require('../dto');
const CommonDto = require('../../../Common/validations/Validation');

const Roles = require('../../../../../enums/roles');

router.post(
  '/',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.Member, Roles.SuperVisor]),
  ValidationMiddleware(VillageDto.create),
  VillageController.create,
);
router.put(
  '/:_id',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.Member, Roles.SuperVisor]),
  ValidationMiddleware(VillageDto.update),
  VillageController.update,
);
router.get(
  '/:_id',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.Member, Roles.SuperVisor]),
  ValidationMiddleware(CommonDto._idDto),
  VillageController.getAll,
);
router.get(
  '/list/all',
  AuthMiddleware([Roles.Owner, Roles.Admin, Roles.Member, Roles.SuperVisor]),
  VillageController.getList,
);
router.get('/mobile/my-locations', AuthMiddleware(Roles.Lead), VillageController.getMyVillages);

module.exports = router;
