const router = require('express').Router();

router.get('/', function (req, res) {
  res.json({ message: 'welcome to version 1' });
});

const user = require('./user/User.Routes');
const auth = require('./auth/Auth.Routes');
const permission = require('./permission/Permission.Routes');
const lead = require('./lead/Lead.Routes');
const ticket = require('./ticket/Ticket.Routes');

router.use('/auth', auth);
router.use('/user', user);
router.use('/lead', lead);
router.use('/permission', permission);
router.use('/ticket', ticket);

module.exports = router;
