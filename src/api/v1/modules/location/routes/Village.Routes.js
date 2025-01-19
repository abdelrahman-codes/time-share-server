const router = require('express').Router();
const { ValidationMiddleware, AuthMiddleware } = require('../../../../../middlewares');
const { VillageController } = require('../controllers');
const { VillageDto } = require('../dto');
const CommonDto = require('../../../Common/validations/Validation');

const Roles = require('../../../../../enums/roles');

router.post('/', AuthMiddleware(Roles.Owner), ValidationMiddleware(VillageDto.create), VillageController.create);
router.put('/:_id', AuthMiddleware(Roles.Owner), ValidationMiddleware(VillageDto.update), VillageController.update);
router.get('/:_id', AuthMiddleware(Roles.Owner), ValidationMiddleware(CommonDto._idDto), VillageController.getAll);
router.get('/list/all', AuthMiddleware(Roles.Owner), VillageController.getList);

module.exports = router;
