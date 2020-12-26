const router = require('express').Router();
const passport = require('passport');
const contactsController = require('../../controllers/users/contacts');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  contactsController.getContacts
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  contactsController.addContacts
);

router.put(
  '/rate',
  passport.authenticate('jwt', { session: false }),
  contactsController.rateContact
);

module.exports = router;
