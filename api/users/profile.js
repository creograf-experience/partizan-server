const router = require('express').Router();
const passport = require('passport');
const profileController = require('../../controllers/users/profile');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  profileController.getProfile
);

router.get(
  '/rating',
  passport.authenticate('jwt', { session: false }),
  profileController.getRating
);

router.put(
  '/',
  passport.authenticate('jwt', { session: false }),
  profileController.update
);

router.put(
  '/public',
  passport.authenticate('jwt', { session: false }),
  profileController.updatePublicProfile
);

router.post('/', profileController.setProfile);

module.exports = router;
