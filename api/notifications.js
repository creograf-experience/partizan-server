const router = require('express').Router();
const passport = require('passport');

const notificationsController = require('../controllers/notifications');

router.get(
  '/notify-contacts',
  passport.authenticate('jwt', { session: false }),
  notificationsController.notifyContacts
);

module.exports = router;
