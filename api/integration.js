const router = require('express').Router();

const integrationController = require('../controllers/integration');

router.get('/comiron/:phone/:comironUserId', integrationController.getComironUser);

module.exports = router;
