const router = require('express').Router();
const authController = require('../../controllers/users/auth');

router.post('/save-phone', authController.savePhone);
router.post('/verify-phone', authController.verifyPhone);
router.post('/is-verified', authController.isVerified);

module.exports = router;
