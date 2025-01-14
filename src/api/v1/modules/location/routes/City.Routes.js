const router = require('express').Router();
const { ValidationMiddleware, AuthMiddleware } = require('../../../../../middlewares');
const { CityController } = require('../controllers');
const { CityDto } = require('../dto');
const Roles = require('../../../../../enums/roles');

router.post('/', AuthMiddleware(Roles.Owner), ValidationMiddleware(CityDto.create), CityController.create);
router.put('/:_id', AuthMiddleware(Roles.Owner), ValidationMiddleware(CityDto.update), CityController.update);
router.get('/', AuthMiddleware(Roles.Owner), CityController.getAll);

module.exports = router;
