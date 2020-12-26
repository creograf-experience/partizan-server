const router = require('express').Router();
const passport = require('passport');
const pushTokenController = require('../../controllers/users/pushtoken');

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  pushTokenController.add
);

router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  pushTokenController.delete
);

module.exports = router;
