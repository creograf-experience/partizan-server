const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/profile', require('./profile'));
router.use('/pushtoken', require('./pushtoken'));
router.use('/chats', require('./chats'));
router.use('/messages', require('./messages'));
router.use('/contacts', require('./contacts'));

module.exports = router;
