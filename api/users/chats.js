const router = require('express').Router();
const passport = require('passport');
const chatsController = require('../../controllers/users/chats');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  chatsController.getAll
);

router.post(
  '/perma-ban',
  passport.authenticate('jwt', { session: false }),
  chatsController.permaBan
);

router.get(
  '/perma-ban/:phone',
  chatsController.permaBanLink
);

module.exports = router;
