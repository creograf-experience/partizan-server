const router = require('express').Router();

router.use('/api/users', require('./users'));
router.use('/api/profiles', require('./profiles'));
router.use('/api/notifications', require('./notifications'));
router.use('/api/integration', require('./integration'));

module.exports = router;
