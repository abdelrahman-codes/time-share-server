const router = require('express').Router();

router.get('/', function (req, res) {
  res.json({ message: 'welcome to version 1' });
});

const userRoutes = require('./user/User.Routes');
const authRoutes = require('./auth/Auth.Routes');
const permissionRoutes = require('./permission/Permission.Routes');
const leadRoutes = require('./lead/Lead.Routes');
const ticketRoutes = require('./ticket/Ticket.Routes');
const { CityRoutes, VillageRoutes } = require('./location/routes');
const contractRoutes = require('./contract/routes/Contract.Routes');
const notificationRoutes = require('./notification/Notification.Routes');
const paymentRoutes = require('./payment/routes/Payment.Routes');
const reservationRoutes = require('./reservation/Reservation.Routes');
const dashboardRoutes = require('./dashboard/Dashboard.Routes');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/lead', leadRoutes);
router.use('/permission', permissionRoutes);
router.use('/ticket', ticketRoutes);
router.use('/city', CityRoutes);
router.use('/village', VillageRoutes);
router.use('/contract', contractRoutes);
router.use('/notification', notificationRoutes);
router.use('/payment', paymentRoutes);
router.use('/reservation', reservationRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
