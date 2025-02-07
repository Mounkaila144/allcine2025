
const router = require('express').Router();
const { register, login, verifyOTP, requestPasswordReset, resetPassword} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
module.exports = router;