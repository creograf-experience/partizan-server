const router = require('express').Router();

const profilesController = require('../controllers/profiles');

router.get('/', profilesController.getAll);

module.exports = router;
