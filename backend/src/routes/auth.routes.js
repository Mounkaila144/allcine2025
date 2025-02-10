
const router = require('express').Router();
const { register, login, verifyOTP, requestPasswordReset, resetPassword,resendOTP} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendOTP); // Ajouter cette ligne

module.exports = router;