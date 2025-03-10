const router = require('express').Router();
const { AuthMiddleware } = require('../../../../middlewares');
const DashboardController = require('./Dashboard.Controller');
const Roles = require('../../../../enums/roles');

router.get('/', AuthMiddleware(Roles.Owner), DashboardController.getDetails);

module.exports = router;
